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

