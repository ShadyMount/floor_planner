import { Card } from "antd";
const { Meta } = Card;

interface ItemsPanelProps {
  onClickCard: (image: string) => void;
}
export const ItemsPanel = ({ onClickCard }: ItemsPanelProps) => {
  const imagesList = [
    "bed1",
    "bed2",
    "chair",
    "chairs",
    "comptable1",
    "comptable2",
    "sofa",
    "table2ch",
    "table4ch",
  ];

  const getImageCards = () => {
    return imagesList.map((image, ind) => {
      return (
        <Card
          onClick={() => onClickCard(image)}
          key={image + ind}
          size="small"
          hoverable
          style={{ width: 150 }}
          className="item"
          cover={<img alt={image} src={`./${image}.png`} />}
        >
          <Meta title={image} />
        </Card>
      );
    });
  };

  return (
    <>
      <div className="scroll">{getImageCards()}</div>
    </>
  );
};
