// src/types/isotope.d.ts

declare module 'isotope-layout' {
    interface IsotopeOptions {
      itemSelector?: string;
      layoutMode?: string;
      percentPosition?: boolean;
      masonry?: {
        columnWidth?: number | string;
      };
      [key: string]: any; // Allow extra options
    }
  
    class Isotope {
      constructor(container: Element | string, options?: IsotopeOptions);
      arrange(options: any): void;
      reloadItems(): void;
      layout(): void;
      destroy(): void;
    }
  
    export default Isotope;
  }
  