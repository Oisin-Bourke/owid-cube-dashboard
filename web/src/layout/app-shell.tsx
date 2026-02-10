const WipBanner = () => {
	return (
		<div className='border-b bg-yellow-50 px-4 py-2 text-sm text-yellow-900'>
			🚧 This project is a work in progress. Data and features may change.
		</div>
	)
}

const AppShell = ({ children }: { children: React.ReactNode }) => (
	<div className='h-dvh overflow-hidden flex flex-col'>
		<WipBanner />
		<div className='flex-1 min-h-0 overflow-y-auto'>{children}</div>
	</div>
)

export default AppShell
