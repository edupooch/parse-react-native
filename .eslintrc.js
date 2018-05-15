module.exports = {
    
        "parser": "babel-eslint",
        "env": {
            "browser": true
        },
        "plugins": [
            "react"
        ],
        "extends": [
            "eslint:recommended",
            "plugin:react/recommended"
        ],
        "rules": {
            // overrides
            "no-console":0,
            "no-unused-vars":1,
        }
};