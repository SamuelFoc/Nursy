import ToggleMenu from "./ToggleMenu";

export default function Navigator({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-4xl sm:text-5xl 3xl:text-7xl font-semibold tracking-tight">
        {title}
      </h1>
      <ToggleMenu />
    </div>
  );
}
