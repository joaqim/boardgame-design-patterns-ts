interface Desc {
  creationDate: Date;
}

interface Address extends Desc {
  zipCode: number;
  addressName: string;
}

interface Order extends Desc {
  id: number;
  orderName: string;
}

interface Detail {
  name: string;
  address: Address;
  orders: Order[];
}


// Table column configuration
interface Column<T> {
  field: keyof T;
  active: boolean;
}

type ConfigurableColumnsKeys<T extends object> = {
  [K in keyof T]: T[K] extends Desc ? K : T[K] extends Desc[] ? K : never
}[keyof T];

type UnboxArray<T> = T extends Array<infer V> ? V : T;

type ColumnConfig<T extends object> = {
  [P in ConfigurableColumnsKeys<T>]: Column<UnboxArray<T[P]>>[]
};

interface Edge {
    a: number,
    b: number,
    directed?: boolean;
}

interface BoardLayout {
    name: string,
    nodes: number[];
    edges: Edge[]
}

const config: ColumnConfig<Detail> = {
  address: [
    {
      field: "zipCode",
      active: true
    },
    {
      field: "addressName", // Ironically, this gave an error, since there was a typo in the interface declaration!
      active: true
    }
  ],
  orders: [
    {
      field: "id",
      active: false
    },
    {
      field: "orderName",
      active: false
    }
  ],
  // Error
}