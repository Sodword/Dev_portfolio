window.bitsExperiments = [
  {
    slug: "interactive-ui-playground",
    title: "Interactive UI Playground",
    description: "A small control room for testing button states, counters, and theme changes in one place.",
    category: "UI",
    tags: ["JavaScript", "UI", "Experiment"],
    icon: "fa-sliders",
    type: "playground",
    how: "Each control updates a small piece of local page state. There is no framework or server involved, which makes the feedback loop easy to inspect.",
    learned: "A useful playground is less about adding lots of controls and more about making each state change visible and predictable."
  },
  {
    slug: "animated-button-effects",
    title: "Animated Button Effects",
    description: "A handful of button treatments that respond to hover, focus, and click without hiding the label.",
    category: "CSS",
    tags: ["CSS", "UI", "Animation"],
    icon: "fa-hand-pointer-o",
    type: "buttons",
    how: "The buttons use transitions and a small pressed state. Keyboard focus remains visible so the visual effect is not mouse-only.",
    learned: "Motion works best when it confirms an action instead of competing with the action itself."
  },
  {
    slug: "custom-loading-animation",
    title: "Custom Loading Animation",
    description: "A loading indicator with idle, loading, and complete states that can be reused around asynchronous UI.",
    category: "Animation",
    tags: ["CSS", "JavaScript", "Animation"],
    icon: "fa-spinner",
    type: "loader",
    how: "The control changes a data state on the preview, while CSS handles the rotating visual. The complete state is deliberately static and readable.",
    learned: "A loading animation needs a clear ending. Without a success or error state, motion becomes noise."
  },
  {
    slug: "interactive-theme-switcher",
    title: "Interactive Theme Switcher",
    description: "A compact light and dark theme experiment that keeps the control usable in either color mode.",
    category: "UI",
    tags: ["JavaScript", "CSS", "UI"],
    icon: "fa-adjust",
    type: "theme",
    how: "A class is toggled on the local preview rather than the whole portfolio, so the experiment cannot change another page’s theme.",
    learned: "Theme changes are a design system problem: colors, borders, focus styles, and readable text all need a deliberate alternate value."
  },
  {
    slug: "scroll-reveal-experiment",
    title: "Scroll Reveal Experiment",
    description: "A small sequence of notes that reveals on demand, using the same restrained motion language as the portfolio.",
    category: "Animation",
    tags: ["JavaScript", "Animation", "CSS"],
    icon: "fa-arrow-down",
    type: "reveal",
    how: "The demo uses IntersectionObserver when available and also includes a button so the behavior can be tested without scrolling a small card.",
    learned: "Reveal effects should support hierarchy. If everything moves, nothing feels important."
  },
  {
    slug: "javascript-counter",
    title: "JavaScript Counter",
    description: "A keyboard-friendly counter with increment, decrement, and reset actions.",
    category: "JavaScript",
    tags: ["JavaScript", "UI", "Experiment"],
    icon: "fa-plus-square-o",
    type: "counter",
    how: "The displayed number is derived from one value and each button sends a named action to update it. Reset returns the local state to zero.",
    learned: "Even a tiny interaction benefits from explicit actions and a visible reset path."
  },
  {
    slug: "password-strength-checker",
    title: "Password Strength Checker",
    description: "A frontend-only strength hint that checks length, character variety, and common weak patterns.",
    category: "JavaScript",
    tags: ["JavaScript", "UI", "Experiment"],
    icon: "fa-lock",
    type: "password",
    how: "The checker evaluates only the text currently in the field. It never stores or sends the value, and its result is a helpful hint rather than a security guarantee.",
    learned: "Client-side feedback can improve form clarity, but it should never be mistaken for server-side security validation."
  },
  {
    slug: "search-filter-experiment",
    title: "Search Filter",
    description: "A live filter that narrows a small set of frontend topics as you type.",
    category: "React",
    tags: ["JavaScript", "React", "UI"],
    icon: "fa-search",
    type: "search",
    how: "The list is kept as data and the visible items are derived from the current query. An explicit empty state explains when there are no matches.",
    learned: "Search feels complete when it handles empty input, partial matches, and no results without making the user guess."
  },
  {
    slug: "accessible-modal-dialog",
    title: "Modal / Dialog Experiment",
    description: "An accessible dialog with a real button trigger, close action, backdrop handling, and Escape support.",
    category: "React",
    tags: ["React", "UI", "Accessibility"],
    icon: "fa-window-maximize",
    type: "modal",
    how: "The dialog uses a native button trigger, dialog semantics, a visible close control, and a keydown listener for Escape. Focus returns to the trigger when it closes.",
    learned: "An overlay is a small component with a surprisingly large responsibility: focus, dismissal, semantics, and scrolling all matter."
  },
  {
    slug: "api-data-connection-scaffold",
    title: "API Data Experiment",
    description: "A calm empty state for an API-powered card, ready for a real endpoint without pretending one is connected.",
    category: "API",
    tags: ["API", "JavaScript", "Experiment"],
    icon: "fa-cloud-download",
    type: "api",
    how: "The preview documents the response states an API feature needs: not configured, loading, success, empty, and error. It intentionally makes no network request.",
    learned: "Designing the states before connecting an endpoint keeps future API work honest and gives the UI a clear contract."
  }
];