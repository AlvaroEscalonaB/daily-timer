export const formatTime = (seconds: number): string => {
  const negative = seconds < 0
  const abs = Math.abs(seconds)
  const m = Math.floor(abs / 60)
  const s = abs % 60
  const body = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return negative ? `-${body}` : body
}
