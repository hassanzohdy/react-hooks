import { useMemo, useState } from "react";
import { FormRowsOptions, RowHandler } from "../types";

export default function useFormRows(
  { initial, addRow, onAdd, onDelete, onChange, onUpdate }: FormRowsOptions = {
    initial: [],
  }
) {
  const prepareRows = (preparingRows: any) => {
    return (preparingRows || []).map((row, index) => ({
      data: row,
      index,
      // add key unique for each row or generate random string
      key: row.key || Math.random().toString(36).substring(7),
    }));
  };

  const [rows, setRows] = useState<RowHandler[]>(prepareRows(initial));

  const addRowCallback = () => {
    const newRowData = (addRow && addRow(rows)) || {};

    const rowIndex = rows.length;

    const newRow = {
      data: newRowData,
      index: rowIndex,
      key: Math.random().toString(36).substring(7),
    };

    const newRows = [...rows, newRow];

    setRows(newRows);

    onAdd && onAdd(newRow, rowIndex, newRows);

    onChange && onChange(newRow, "add", rowIndex, newRows);
  };

  const finalRows: RowHandler[] = useMemo(() => {
    return rows.map((row, index) => ({
      ...row,
      index: index,
      update: (newRow: any) => {
        if (newRow === finalRows[index].data) return;

        const newRows = [...rows];
        newRows[index].data = newRow;

        setRows(newRows);

        onUpdate && onUpdate(newRow, index, newRows);

        onChange && onChange(newRows, "update", index, newRows);
      },
      remove: () => {
        rows.splice(index, 1);

        const newRows = [...rows].map((row, index) => ({
          ...row,
          index,
        }));

        setRows(newRows);

        onDelete && onDelete(row, index, newRows);

        onChange && onChange(rows, "delete", index, newRows);
      },
    }));
  }, [rows, onDelete]);

  const setRowCallback = (rows: any) => {
    setRows(prepareRows(rows));
  };

  return [finalRows, addRowCallback, setRowCallback] as const;
}
