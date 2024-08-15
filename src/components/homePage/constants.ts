import type { DSTreeItem } from '@/lib/dialect/interface'

export const exampleDSTree = [
  {
    key: 'mydb',
    name: 'mystore',
    type: 'database',
    path: 'mydb.db',
    children: [
      {
        key: 'mydb-main',
        name: 'main',
        type: 'schema',
        children: [
          {
            key: 'mydb-main-__tables__',
            name: 'tables',
            type: 'collection',
            for: 'table',
            children: [
              {
                key: 'mydb-main-products',
                name: 'products',
                type: 'table',
                children: [
                  {
                    key: 'mydb-main-products-id',
                    name: 'id',
                    type: 'column',
                    dataType: 'UUID',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-products-name',
                    name: 'name',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-products-heading',
                    name: 'heading',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-products-description',
                    name: 'description',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-products-price',
                    name: 'price',
                    type: 'column',
                    dataType: 'DECIMAL(18,3)',
                    isNullable: false,
                  },
                ],
              },
              {
                key: 'mydb-main-customers',
                name: 'customers',
                type: 'table',
                children: [
                  {
                    key: 'mydb-main-customers-id',
                    name: 'id',
                    type: 'column',
                    dataType: 'UUID',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-customers-firstName',
                    name: 'firstName',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-customers-lastName',
                    name: 'lastName',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                  {
                    key: 'mydb-main-customers-emailAddress',
                    name: 'emailAddress',
                    type: 'column',
                    dataType: 'VARCHAR',
                    isNullable: false,
                  },
                ],
              },
            ],
          },
          {
            key: 'mydb-main-__views__',
            name: 'views',
            type: 'collection',
            for: 'view',
            children: [],
          },
          {
            key: 'mydb-main-__functions__',
            name: 'procedures',
            type: 'collection',
            for: 'function',
            children: [],
          },
        ],
      },
    ],
  },
] as DSTreeItem[]
