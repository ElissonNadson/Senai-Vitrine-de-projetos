const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // check if getBaseRoute(user?.tipo) or getBaseRoute(user.tipo) exists
    if (content.includes('getBaseRoute(user?.tipo)') || content.includes('getBaseRoute(user.tipo)')) {

        // Attempt useAuth modification if not there
        if (content.includes('useAuth') && !content.includes('viewMode } = useAuth') && !content.includes('viewMode} = useAuth')) {
            // Find const { user... } = useAuth()
            const index = content.indexOf('} = useAuth()');
            if (index !== -1) {
                content = content.replace(/} = useAuth\(\)/g, ', viewMode } = useAuth()');
            }
        }

        content = content.replace(/getBaseRoute\(user\?\.tipo\)/g, 'getBaseRoute(viewMode || user?.tipo)');
        content = content.replace(/getBaseRoute\(user\.tipo\)/g, 'getBaseRoute(viewMode || user?.tipo)');

        if (original !== content) {
            fs.writeFileSync(file, content);
            console.log('Patched', file);
            count++;
        }
    }
});

console.log('Total patched:', count);
