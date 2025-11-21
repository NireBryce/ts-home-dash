# Variables
nvm_dir := env_var_or_default('NVM_DIR', env_var('HOME') + '/.nvm')

# Load nvm into the current shell and print Node version
nvm-load:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "nvm loaded successfully"
    echo "Current Node version: $(node --version)"
    echo "Current npm version: $(npm --version)"

# Load nvm and switch to a specific Node version
nvm-use version:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Loading nvm and switching to Node {{version}}..."
    nvm use {{version}}
    echo "Current Node version: $(node --version)"

# Load nvm and use the version specified in .nvmrc
nvm-use-nvmrc:
    #!/usr/bin/env zsh
    set -e
    if [ ! -f .nvmrc ]; then
        echo "Error: .nvmrc file not found in current directory"
        exit 1
    fi
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Loading nvm and using version from .nvmrc..."
    nvm use
    echo "Current Node version: $(node --version)"

# Install a specific Node version with nvm
nvm-install version:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Installing Node {{version}}..."
    nvm install {{version}}
    echo "Installation complete. Current Node version: $(node --version)"

# List all installed Node versions
nvm-list:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm list


# ============================== npm init typescript ==============================

# Initialize a new npm project with TypeScript
npm-init-ts name:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Initializing new TypeScript project: {{name}}"
    mkdir -p {{name}}
    cd {{name}}
    npm init -y
    echo "Installing TypeScript and essential dependencies..."
    npm install --save-dev typescript @types/node
    npx tsc --init
    echo "✓ TypeScript project initialized in ./{{name}}"
    echo "Next steps: cd {{name}} && configure tsconfig.json"

# Initialize npm project in current directory with TypeScript
npm-init-ts-here:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Initializing TypeScript in current directory..."
    npm init -y
    echo "Installing TypeScript and essential dependencies..."
    npm install --save-dev typescript @types/node
    npx tsc --init
    echo "✓ TypeScript project initialized"

# Initialize with common TypeScript tooling (ESLint, Prettier, ts-node)
npm-init-ts-full name:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Initializing full TypeScript project: {{name}}"
    mkdir -p {{name}}
    cd {{name}}
    npm init -y
    echo "Installing TypeScript and tooling..."
    npm install --save-dev typescript @types/node ts-node nodemon
    npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
    npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
    npx tsc --init
    echo "Creating basic project structure..."
    mkdir -p src
    echo 'console.log("Hello, TypeScript!");' > src/index.ts
    echo "✓ Full TypeScript project initialized in ./{{name}}"
    echo "Installed: TypeScript, ESLint, Prettier, ts-node, nodemon"

# Install TypeScript with Express and types
npm-init-ts-express name:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Initializing TypeScript Express project: {{name}}"
    mkdir -p {{name}}
    cd {{name}}
    npm init -y
    echo "Installing Express with TypeScript..."
    npm install express
    npm install --save-dev typescript @types/node @types/express ts-node nodemon
    npx tsc --init
    mkdir -p src
    echo "✓ TypeScript Express project initialized in ./{{name}}"

# Install TypeScript with React (using Vite)
npm-init-ts-react name:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Initializing TypeScript React project with Vite: {{name}}"
    npm create vite@latest {{name}} -- --template react-ts
    echo "✓ TypeScript React project initialized in ./{{name}}"
    echo "Next steps: cd {{name}} && npm install && npm run dev"

# Add TypeScript to existing npm project
npm-add-ts:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Adding TypeScript to existing project..."
    npm install --save-dev typescript @types/node
    npx tsc --init
    echo "✓ TypeScript added to project"
    echo "Configure tsconfig.json as needed"

# Install common TypeScript testing tools (Jest)
npm-add-jest-ts:
    #!/usr/bin/env zsh
    set -e
    export NVM_DIR="{{nvm_dir}}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "Installing Jest with TypeScript support..."
    npm install --save-dev jest @types/jest ts-jest
    npx ts-jest config:init
    echo "✓ Jest with TypeScript installed"

# Show common npm scripts for TypeScript projects
npm-ts-scripts:
    @echo "Common package.json scripts for TypeScript projects:"
    @echo ""
    @echo '"scripts": {'
    @echo '  "build": "tsc",'
    @echo '  "start": "node dist/index.js",'
    @echo '  "dev": "nodemon --exec ts-node src/index.ts",'
    @echo '  "test": "jest",'
    @echo '  "lint": "eslint . --ext .ts",'
    @echo '  "format": "prettier --write \"src/**/*.ts\""'
    @echo '}'
