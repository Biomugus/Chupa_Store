type CartSummaryProps = {
  total: number
}

export default function CartSummaryUI({ total }: CartSummaryProps) {
  return (
    <aside>
      <div>Summary</div>
      <div>Total: {total}</div>
    </aside>
  )
}
