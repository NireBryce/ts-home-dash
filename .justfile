# Import modules from .just directory (recursively searches subdirectories)
import? '.just/**/*.just'

# Default recipe - show available commands
default:
    @just --list

