type ConstructorCanvasProps = {
  layers: string[];
};

export default function ConstructorCanvas({ layers }: ConstructorCanvasProps) {
  return (
    <div>
      <div>Canvas</div>
      <pre>{JSON.stringify(layers, null, 2)}</pre>
    </div>
  );
}

