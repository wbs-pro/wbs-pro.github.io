import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const ContentPlaceholder: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`content-placeholder ${displayClass ?? ""}`}>
        <div class="placeholder-inner"></div>
      </div>
    )
  }

  ContentPlaceholder.css = `
    .content-placeholder {
      width: 100%;
      height: 200px; /* Adjust based on expected content height */
      margin-bottom: 1rem;
    }
    
    @media all and (max-width: 600px) {
      .content-placeholder {
        height: 150px; /* Smaller on mobile */
      }
    }
  `

  return ContentPlaceholder
}) satisfies QuartzComponentConstructor 