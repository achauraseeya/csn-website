const fs = require('fs');
let code = fs.readFileSync('src/components/RenownedPeople.tsx', 'utf8');

// Remove queuedMessage state
code = code.replace(/  const \[queuedMessage, setQueuedMessage\] = useState<string \| null>\(null\);\n/, '');

// Remove handleQueuedEvent and listeners
code = code.replace(/    \/\/ Listen for custom change queue event to show feedback[\s\S]*?    window\.addEventListener\('chaurasiya_change_queued', handleQueuedEvent\);\n    return \(\) => window\.removeEventListener\('chaurasiya_change_queued', handleQueuedEvent\);\n/, '');

// Remove the queuedMessage UI block
code = code.replace(/      \{queuedMessage && \([\s\S]*?      \)\}\n/, '');

fs.writeFileSync('src/components/RenownedPeople.tsx', code);
