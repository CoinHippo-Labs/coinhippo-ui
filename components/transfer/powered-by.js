import Image from '../image'

export default () => {
  return (
    <div className="flex items-center justify-end space-x-1.5">
    	<span>
    		via
    	</span>
    	<a
        href="https://0xsquid.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Squid
      </a>
      <span>
      	on
      </span>
      <a
        href="https://axelar.network"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1"
      >
    		<Image
          src="/logos/externals/axelar.png"
          alt=""
          width={20}
          height={20}
        />
        <span>
        	Axelar Network
        </span>
      </a>
    </div>
  )
}