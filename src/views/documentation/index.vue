<template>
  <div>
    <h1 style="color: red;">Button</h1>

    <!-- Elemen dengan tampilan warna orange -->
    <el-button class="orange-button">Orange Button</el-button>

    <!-- Elemen dengan tampilan warna black -->
    <el-button type="primary" class="black-element">Black Button</el-button>

    <h1>Tabel</h1>
    <div style="margin: 20px;">
      <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="120" />
        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column prop="zip" label="Zip" width="120" />

        <el-table-column fixed="right" label="Operations" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle />
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Documentation',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-08',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-06',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-07',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }
      ]
    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table .warning-row  {
    background: yellow !important;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .el-table__body-wrapper {
    overflow: auto;
    max-height: 250px;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px;
  }
  .el-button .orange-button {
    background-color: #fbae17 !important;
    color: red !important;
  }

  .black-element {
    background-color: #4e4e4e;
    color: white;
  }
  .el-table__body-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: #888;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
