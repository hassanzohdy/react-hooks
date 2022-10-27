import React, { useEffect, useState } from "react";
import { CachedRowCallback, CachedRowProps, RowHandler } from "../types";

function CachedRow({ row, callback }: CachedRowProps) {
  const [value, setValue] = useState(row.data);

  const updateRows = row.update;

  useEffect(() => {
    // shall be updated if user called the the incoming row data is changed
    setValue(value);
  }, [row.data]);

  return (
    <React.Fragment key={row.key}>
      {callback({
        ...row,
        data: value,
        update: setValue,
        fullUpdate: (newRows: any) => {
          setValue(newRows);
          updateRows(newRows);
        },
      })}
    </React.Fragment>
  );
}

export default function useCachedRows(
  rows: RowHandler[],
  callback: CachedRowCallback
) {
  return React.useMemo(() => {
    return rows.map((row) => {
      return <CachedRow key={row.key} row={row} callback={callback} />;
    });
  }, [callback, rows]);
}
