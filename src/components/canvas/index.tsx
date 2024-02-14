import "./Canvas.css";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Interface from "./Interface";
import { useCallback, useEffect, useState } from "react";

export default function CanvasApp() {
  const { editor, onReady } = useFabricJSEditor();
  const [isStickyGrid, setIsStickyGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  const [gridLinesGroup, setGridLinesGroup] = useState<fabric.Group>();

  const createGrid = useCallback(() => {
    const gridlines = [];
    for (let i = 0; i < 600 / gridSize; i++) {
      gridlines.push(
        new fabric.Line([i * gridSize, 0, i * gridSize, 600], {
          stroke: "#ccc",
          selectable: false,
          evented: false,
        })
      );
      gridlines.push(
        new fabric.Line([0, i * gridSize, 600, i * gridSize], {
          stroke: "#ccc",
          selectable: false,
          evented: false,
        })
      );
    }
    const linesGroup = new fabric.Group(gridlines, {
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
    setGridLinesGroup(linesGroup);
    editor?.canvas.add(linesGroup);
    editor?.canvas.sendToBack(linesGroup);
  }, [editor, gridSize]);

  const toggleStickyGrid = useCallback(() => {
    setIsStickyGrid((stickyGrid) => !stickyGrid);
  }, []);

  const changeGridSize = useCallback(
    (value: number | null) => {
      gridLinesGroup && editor?.canvas.remove(gridLinesGroup);
      setGridSize(value || 10);
    },
    [editor, gridLinesGroup]
  );

  const clickCardHandler = useCallback(
    (image: string) => {
      fabric.Image.fromURL(`${image}.png`, function (oImg) {
        editor?.canvas.add(oImg);
      });
    },
    [editor]
  );

  const saveHandler = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(editor?.canvas)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  }, [editor]);

  const uploadFileHandler = useCallback(
    (file: string | ArrayBuffer | null | undefined) => {
      editor?.canvas.loadFromJSON(file, () => {
        createGrid();
      });
    },
    [createGrid, editor?.canvas]
  );

  const removeSelectedHandler = useCallback(() => {
    editor?.deleteSelected();
  }, [editor]);

  const removeAllHandler = useCallback(() => {
    editor?.deleteAll();
    createGrid();
  }, [createGrid, editor]);

  useEffect(() => {
    createGrid();

    editor?.canvas.on("object:moving", function (options) {
      if (isStickyGrid) {
        options?.target?.set({
          left:
            Math.round((options.target.left as number) / gridSize) * gridSize,
          top: Math.round((options.target.top as number) / gridSize) * gridSize,
        });
      }

      options?.target?.setCoords();
      editor?.canvas.forEachObject(function (obj) {
        if (obj === options.target) return;
        obj.set(
          "opacity",
          options?.target?.intersectsWithObject(obj) ? 0.5 : 1
        );
      });
    });

    return () => {
      editor?.canvas.off("object:moving");
      gridLinesGroup && editor?.canvas.remove(gridLinesGroup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.canvas, gridSize, isStickyGrid]);
  return (
    <div className="container">
      <Interface
        onSave={saveHandler}
        onRemoveAll={removeAllHandler}
        onRemoveSelected={removeSelectedHandler}
        onClickCard={clickCardHandler}
        gridSize={gridSize}
        onUploadFile={uploadFileHandler}
        stickyGrid={isStickyGrid}
        onToggleStickyGrid={toggleStickyGrid}
        onChangeGridSize={changeGridSize}
      />
      <div>
        <FabricJSCanvas className="canvas" onReady={onReady} />
      </div>
    </div>
  );
}
