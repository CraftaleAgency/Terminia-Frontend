const fs = require('fs');
const path = require('path');

// Create directory
const dir = path.join('app', 'dashboard', 'alerts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✓ Created directory:', dir);
}

// Read source file
const source = path.join('ALERTS_PAGE.tsx');
const target = path.join(dir, 'page.tsx');

if (fs.existsSync(source)) {
  const content = fs.readFileSync(source, 'utf8');
  fs.writeFileSync(target, content, 'utf8');
  console.log('✓ Created file:', target);
  console.log('\n✅ Setup completato! La pagina alerts è ora disponibile su /dashboard/alerts');
  console.log('\nPuoi eliminare i file temporanei con:');
  console.log('  del ALERTS_PAGE.tsx ALERTS_PAGE_SETUP.md install-alerts.js');
} else {
  console.error('✗ File ALERTS_PAGE.tsx not found');
  process.exit(1);
}
