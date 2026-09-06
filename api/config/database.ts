import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  
  connection: 'sqlite',

  connections: {
    
    sqlite: {
      client: 'better-sqlite3',

      connection: {
        filename:
          process.env.NODE_ENV === 'test'
            ? app.tmpPath('db.test.sqlite3')
            : app.tmpPath('db.sqlite3'),
      },

      
      useNullAsDefault: true,

      migrations: {
        
        naturalSort: true,

        
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        
        enabled: true,

        
        rulesPaths: ['./database/schema_rules.js'],
      },
    },

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
  },
})

export default dbConfig
