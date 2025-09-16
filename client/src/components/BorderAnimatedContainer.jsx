// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/

const borderStyles = [
  'w-full h-full rounded-2xl border border-transparent',
  'flex overflow-hidden animate-border',
  '[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box]',
].join(' ');

function BorderAnimatedContainer({ children }) {
  return <div className={borderStyles}>{children}</div>;
}
export default BorderAnimatedContainer;
