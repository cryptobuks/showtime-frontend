import Link from 'next/link'
import mixpanel from 'mixpanel-browser'

export default function Like({ act }) {
	const { nfts } = act
	const count = nfts?.length
	return (
		<div className="flex flex-col">
			<div className="text-gray-500 dark:text-gray-400">
				{count === 1 && (
					<>
						Liked{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[0].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count === 2 && (
					<>
						Liked{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[0].token_name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[1].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count === 3 && (
					<>
						Liked{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[0].token_name}
							</a>
						</Link>
						,{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[1].token_name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href={`/t/${nfts[2].contract_address}/${nfts[2].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[2].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count > 3 && (
					<>
						Liked{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[0].token_name}
							</a>
						</Link>
						,{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={() => mixpanel.track('Activity - Click on NFT title')}>
								{nfts[1].token_name}
							</a>
						</Link>{' '}
						and {count - 2} others.
					</>
				)}
			</div>
		</div>
	)
}
