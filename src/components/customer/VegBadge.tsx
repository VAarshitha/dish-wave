export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className="inline-flex h-4 w-4 items-center justify-center rounded-sm border"
      style={{
        borderColor: isVeg ? "var(--veg)" : "var(--nonveg)",
      }}
    >
      <span
        className="block h-2 w-2 rounded-full"
        style={{ backgroundColor: isVeg ? "var(--veg)" : "var(--nonveg)" }}
      />
    </span>
  );
}
