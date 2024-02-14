import {
  Button,
  Checkbox,
  InputNumber,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import "./Interface.css";
import { ItemsPanel } from "./ItemsPanel";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

interface CanvasInterfaceProps {
  stickyGrid: boolean;
  onToggleStickyGrid: () => void;
  gridSize: number;
  onChangeGridSize: (value: number | null) => void;
  onClickCard: (image: string) => void;
  onSave: () => void;
  onRemoveSelected: () => void;
  onRemoveAll: () => void;
  onUploadFile: (file: string | ArrayBuffer | null | undefined) => void;
}

export default function CanvasInterface({
  stickyGrid,
  onChangeGridSize,
  onToggleStickyGrid,
  gridSize,
  onSave,
  onRemoveAll,
  onUploadFile,
  onClickCard,
  onRemoveSelected,
}: CanvasInterfaceProps) {
  const handleFileUpload = (info: UploadChangeParam<UploadFile<Blob>>) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onUploadFile(e?.target?.result as string);
    };
    reader.readAsText(info.file.originFileObj as Blob);
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleUploadProps: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleFileUpload,
    showUploadList: false,
  };

  return (
    <div className="Interface">
      <ItemsPanel onClickCard={onClickCard} />
      <Checkbox
        title="Прилипающая сетка"
        checked={stickyGrid}
        onChange={onToggleStickyGrid}
      >
        Прилипающая сетка
      </Checkbox>
      <Typography>
        Размер сетки{" "}
        <InputNumber
          min={1}
          title="Размер сетки"
          max={50}
          defaultValue={gridSize}
          onChange={onChangeGridSize}
        />
      </Typography>
      <Button onClick={onRemoveSelected}>Удалить выделенные</Button>
      <Button onClick={onRemoveAll}>Удалить все</Button>
      <Button onClick={onSave} type="primary">
        Сохранить
      </Button>
      <Upload {...handleUploadProps}>
        <Button icon={<UploadOutlined />}>Загрузить JSON</Button>
      </Upload>
    </div>
  );
}
