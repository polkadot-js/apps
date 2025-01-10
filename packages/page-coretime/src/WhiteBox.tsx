export const WhiteBox = ({ children }: { children: React.ReactNode }) => {
    return <div style={{ backgroundColor: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifySelf: 'right', minWidth: '250px', padding: '24px' }}>
        {children}
    </div>
};