import Copy from '../copy'

export default ({
  src,
  title,
  width,
  height,
  value,
}) => {
  return (
    <div>
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        width={width}
        height={height}
        className="mx-auto"
      />
      <span className="flex items-center justify-center space-x-1">
        <Copy
          size={20}
          value={value}
          title="Copy iframe"
        />
      </span>
    </div>
  )
}