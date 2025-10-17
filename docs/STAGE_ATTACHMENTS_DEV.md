# Stage Attachments Feature

## Quick Start

This feature adds file/link upload capabilities to each project stage with specific options per stage.

## What Changed

### New Component: `StageAttachmentsManager`
Location: `src/features/student/create-project/components/steps/StageAttachmentsManager.tsx`

Provides:
- Stage-specific attachment options (28 total across 4 stages)
- File upload with drag-and-drop
- Link input for videos
- Validation (at least 1 attachment per filled stage)
- Visual feedback

### Updated Components

**TimelineProgressStep.tsx**
- Added `attachments` field to `TimelineStep` interface
- Integrated `StageAttachmentsManager` for each stage
- Added validation function
- Added attachment count badge
- Updated stage names to Portuguese (Ideação, Modelagem, Prototipagem, Implementação)

**ImprovedPage.tsx**
- Enhanced `validateStep('timeline')` to check attachments

## Usage

```tsx
import StageAttachmentsManager from './StageAttachmentsManager'

<StageAttachmentsManager
  stageType="Ideação"
  attachments={[]}
  onChange={(attachments) => console.log(attachments)}
  error="Adicione pelo menos um arquivo"
/>
```

## Stage Options

### Ideação (8 options)
- Crazy 8 (file: pdf, jpg, png)
- Mapa Mental (file: pdf, jpg, png)
- Value Proposition Canvas (file: pdf, jpg, png)
- Customer Journey Map (file: pdf, jpg, png)
- SCAMPER (file: pdf, jpg, png, docx)
- Mapa de Empatia (file: pdf, jpg, png)
- Vídeo Pitch (link)
- Persona (file: pdf, jpg, png)

### Modelagem (5 options)
- Business Model Canvas (file: pdf, jpg, png)
- Planilha de Viabilidade (file: pdf, xlsx, xls)
- Análise SWOT (file: pdf, jpg, png, docx)
- Matriz de Riscos (file: pdf, xlsx, xls, jpg, png)
- Cronograma (file: pdf, xlsx, xls, jpg, png)

### Prototipagem (6 options)
- Wireframes (file: pdf, jpg, png, fig)
- Mockups (file: pdf, jpg, png, fig)
- Protótipo Interativo (link)
- Modelagem 3D (file: pdf, stl, obj, jpg, png)
- Maquete Física (file: jpg, png, mp4, mov)
- Fluxograma (file: pdf, jpg, png)

### Implementação (7 options)
- Vídeo Pitch (link)
- Teste Piloto (file: pdf, docx, jpg, png)
- Registro de Testes (file: pdf, txt, xlsx, xls)
- Feedback do Cliente (file: pdf, xlsx, xls, jpg, png)
- Entrevista (file: pdf, docx, mp3, mp4)
- Vídeo de Usuários (link)
- Relato de Experiência (link)

## Validation Rules

- **Required**: At least 1 attachment per filled stage (has title AND description)
- **Optional**: Stages without content don't require attachments
- **Flexible**: Can add multiple attachments of the same or different types
- **Validated**: On form submission (when publishing project)

## Data Structure

```typescript
interface StageAttachment {
  id: string
  optionId: string
  type: 'file' | 'link'
  file?: File
  link?: string
  name: string
}

interface TimelineStep {
  id: string
  uuid?: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  ordem: number
  isSaved?: boolean
  attachments?: StageAttachment[]
}
```

## API Integration

The component prepares data for the existing API endpoint:

```
POST /api/v1/senai/AnexoEtapa/create
{
  "etapa": { "uuid": "..." },
  "nomeArquivo": "...",
  "url": "...",
  "tipo": "...",
  "dataUpload": "..."
}
```

## Visual Indicators

- 📎 Badge with count in stage header
- ✅ Green checkmark when attachment added
- ⚠️ Red error message when validation fails
- 🔄 Drag-and-drop visual feedback

## Testing

No automated tests yet, but you can manually test:

1. Go to Create Project page
2. Navigate to Timeline step
3. Fill in a stage title and description
4. Try adding file (drag or click)
5. Try adding link
6. Check validation by trying to submit without attachments
7. Verify attachment count badge appears

## Notes

- Files are stored in component state until project is published
- Validation only runs when moving to Review step or submitting
- Empty stages don't require attachments
- Links must start with http:// or https://
