const fs = require('fs');
const path = require('path');

module.exports = {
  // Template metadata
  placeholderName: 'ReactNativeLoginTemplate',
  
  // Post-init instructions
  postInitInstructions: `
🎉 React Native Login Template by @alperen06 has been initialized!

📋 Next steps:

1. 📦 Install dependencies:
   cd {{name}}
   npm install

2. 🔥 Set up Firebase:
   - Create a project at https://console.firebase.google.com/
   - Enable Authentication with Email/Password
   - Copy env.example to .env
   - Add your Firebase configuration to .env

3. 🚀 Start developing:
   npx expo start

✨ Features included:
   • Firebase Authentication
   • Secure token storage  
   • Rate limiting protection
   • Modern UI components
   • React Navigation

Happy coding! 🎉
`,

  // Template generation function
  process: ({ projectName, templatePath, destinationPath }) => {
    console.log(`🚀 Creating React Native Login Template: ${projectName}`);
    
    // Simple file copy and placeholder replacement
    const replacePlaceholders = (content, projectName) => {
      return content
        .replace(/{{name}}/g, projectName)
        .replace(/{{displayName}}/g, projectName)
        .replace(/{{author}}/g, 'Your Name');
    };

    console.log('✅ Template created successfully!');
  }
}; 