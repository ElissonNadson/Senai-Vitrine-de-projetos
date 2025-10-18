# 🔐 Sessões Ativas - Explicação e Implementação

## 📌 O que são Sessões Ativas?

As **Sessões Ativas** são uma funcionalidade de segurança que permite ao usuário visualizar e gerenciar todos os dispositivos/navegadores onde ele está logado simultaneamente.

### Exemplo Prático:
Se você fizer login no sistema em:
- Computador do trabalho (Chrome)
- Notebook de casa (Firefox)
- Celular (Safari)

Você verá **3 sessões ativas** na página de segurança, podendo encerrar qualquer uma delas remotamente.

---

## 🎯 Para que serve?

1. **Segurança**: Detectar acessos não autorizados
2. **Controle**: Encerrar sessões antigas ou suspeitas
3. **Transparência**: Ver onde você está logado

---

## 🛠️ O que falta para funcionar?

Atualmente, a interface está pronta, mas **não está conectada ao backend**. Aqui está o que precisa ser implementado:

### 1️⃣ **No Backend (API)**

#### A. Criar tabela de sessões no banco de dados
```sql
CREATE TABLE sessoes_usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(uuid) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  navegador VARCHAR(100),
  sistema_operacional VARCHAR(100),
  dispositivo VARCHAR(100),
  localizacao VARCHAR(255),
  criado_em TIMESTAMP DEFAULT NOW(),
  ultimo_acesso TIMESTAMP DEFAULT NOW(),
  ativo BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessoes_usuario ON sessoes_usuarios(usuario_id);
CREATE INDEX idx_sessoes_token ON sessoes_usuarios(access_token);
```

#### B. Criar endpoints na API

**1. Listar sessões ativas do usuário**
```typescript
GET /api/auth/sessions
Authorization: Bearer {token}

Response:
{
  "sessions": [
    {
      "id": "uuid",
      "navegador": "Chrome",
      "sistemaOperacional": "Windows 10",
      "dispositivo": "Desktop",
      "localizacao": "São Paulo, Brasil",
      "ipAddress": "192.168.1.1",
      "ultimoAcesso": "2024-01-18T10:30:00Z",
      "estaAtiva": true,
      "eSessaoAtual": true
    }
  ]
}
```

**2. Encerrar uma sessão específica**
```typescript
DELETE /api/auth/sessions/:sessionId
Authorization: Bearer {token}

Response:
{
  "message": "Sessão encerrada com sucesso"
}
```

**3. Encerrar todas as outras sessões**
```typescript
DELETE /api/auth/sessions/others
Authorization: Bearer {token}

Response:
{
  "message": "Todas as outras sessões foram encerradas",
  "sessionsTerminated": 3
}
```

#### C. Modificar o processo de login

Quando o usuário faz login, além de gerar os tokens, você precisa:

```typescript
// Exemplo em Node.js/Express
async function login(req, res) {
  // ... validação de credenciais ...
  
  const { accessToken, refreshToken } = gerarTokens(usuario);
  
  // ADICIONAR: Salvar informações da sessão
  await criarSessao({
    usuarioId: usuario.uuid,
    accessToken: accessToken,
    refreshToken: refreshToken,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    // Usar biblioteca como 'ua-parser-js' para extrair:
    navegador: parseUserAgent(req).browser,
    sistemaOperacional: parseUserAgent(req).os,
    dispositivo: parseUserAgent(req).device,
    // Usar serviço de geolocalização por IP (ex: ipapi.co)
    localizacao: await obterLocalizacaoPorIP(req.ip)
  });
  
  res.json({ accessToken, refreshToken, usuario });
}
```

#### D. Middleware de validação de token

```typescript
async function validarToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // Verificar se o token é válido
  const decoded = jwt.verify(token, SECRET_KEY);
  
  // ADICIONAR: Verificar se a sessão ainda está ativa
  const sessao = await buscarSessaoPorToken(token);
  
  if (!sessao || !sessao.ativo) {
    return res.status(401).json({ 
      error: 'Sessão inválida ou expirada' 
    });
  }
  
  // Atualizar último acesso
  await atualizarUltimoAcesso(sessao.id);
  
  req.usuario = decoded;
  req.sessao = sessao;
  next();
}
```

---

### 2️⃣ **No Frontend (React)**

Você já tem a interface, mas precisa conectar aos endpoints:

```typescript
// Em SecurityTab.tsx

const [sessions, setSessions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  carregarSessoes();
}, []);

const carregarSessoes = async () => {
  try {
    const response = await fetch('/api/auth/sessions', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    setSessions(data.sessions);
  } catch (error) {
    console.error('Erro ao carregar sessões:', error);
  } finally {
    setLoading(false);
  }
};

const encerrarSessao = async (sessionId: string) => {
  try {
    await fetch(`/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    // Recarregar lista
    carregarSessoes();
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
  }
};

const encerrarTodasOutras = async () => {
  try {
    await fetch('/api/auth/sessions/others', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    carregarSessoes();
  } catch (error) {
    console.error('Erro ao encerrar sessões:', error);
  }
};
```

---

## 📦 Bibliotecas Úteis

### Para o Backend:
```bash
npm install ua-parser-js  # Parser de User-Agent
npm install axios         # Para chamadas à API de geolocalização
```

### Exemplo de uso:
```typescript
import UAParser from 'ua-parser-js';

function parseUserAgent(req) {
  const parser = new UAParser(req.headers['user-agent']);
  const result = parser.getResult();
  
  return {
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    device: result.device.type || 'Desktop'
  };
}

async function obterLocalizacaoPorIP(ip: string) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return `${response.data.city}, ${response.data.country_name}`;
  } catch {
    return 'Localização desconhecida';
  }
}
```

---

## 🔄 Fluxo Completo

1. **Login**: Usuário faz login → Backend cria uma nova sessão no banco
2. **Uso**: A cada requisição, o middleware valida o token e atualiza `ultimo_acesso`
3. **Visualização**: Usuário acessa a página de segurança → Frontend busca todas as sessões ativas
4. **Encerramento**: Usuário clica em "Encerrar" → Backend marca a sessão como inativa → Token é invalidado

---

## ⚠️ Considerações de Segurança

1. **Expiração automática**: Sessões antigas devem expirar automaticamente
2. **Limite de sessões**: Você pode limitar o número máximo de sessões simultâneas
3. **Notificações**: Avisar o usuário quando um novo login é detectado
4. **Logs**: Registrar todas as ações de segurança para auditoria

---

## ✅ Resumo

**Status Atual**: Interface pronta no frontend ✅  
**Falta implementar**: 
- [ ] Tabela de sessões no banco de dados
- [ ] Endpoints da API (listar, encerrar)
- [ ] Modificar login para criar sessões
- [ ] Middleware de validação de token com verificação de sessão
- [ ] Conectar frontend aos endpoints

**Tempo estimado de implementação**: 4-8 horas de desenvolvimento

---

## 💡 Dica

Comece implementando apenas a **listagem de sessões** para testar. Depois adicione as funcionalidades de **encerramento**.
