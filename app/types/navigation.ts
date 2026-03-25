export interface NavigationLink {
  label: string;
  url: string;
}

export interface MegaMenuColumn {
  type: "links" | "featured";
  title: string;
  links?: NavigationLink[];
  bottom_link?: NavigationLink;
}

export interface NavigationItem {
  label: string;
  url: string;
  mega_menu?: MegaMenuColumn[];
}
