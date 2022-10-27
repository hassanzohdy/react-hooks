import { useMemo, useState } from "react";
import { FormRowsOptions, FormRowsResult, RowHandler } from "../types";

export default function useFormRows(
  { initial, addRow, onAdd, onDelete, onChange, onUpdate }: FormRowsOptions = {
    initial: [],
  }
): FormRowsResult {
  const prepareRows = (preparingRows: any) => {
    return (preparingRows || []).map((row, index) => ({
      data: row,
      index,
      // add key unique for each row or generate random string
      key: row.key || Math.random().toString(36).substring(7),
    }));
  };

  const [rows, setRows] = useState(prepareRows(initial));

  const addRowCallback = () => {
    const newRow = (addRow && addRow(rows)) || {};

    const newRows = prepareRows([...rows, newRow]);

    setRows(newRows);

    const rowIndex = newRow.length - 1;

    const finalRow = newRows[rowIndex];

    onAdd && onAdd(finalRow, rowIndex, newRows);

    onChange && onChange(finalRow, "add", rowIndex, newRows);
  };

  const finalRows: RowHandler[] = useMemo(() => {
    return rows.map((row, index) => ({
      ...row,
      update: (newRow: any) => {
        let newRows = [...rows];
        newRows[index] = newRow;

        newRows = prepareRows(newRows);

        setRows(newRows);

        onUpdate && onUpdate(newRow, index, newRows);

        onChange && onChange(newRows, "update", index, newRows);
      },
      remove: () => {
        rows.splice(index, 1);
        const newRows = [...prepareRows(rows)];
        setRows(newRows);

        onDelete && onDelete(row, index, newRows);

        onChange && onChange(rows, "delete", index, newRows);
      },
    }));
  }, [rows, onDelete]);

  return [finalRows, addRowCallback];
}
