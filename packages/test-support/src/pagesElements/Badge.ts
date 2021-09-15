import {fireEvent, screen} from "@testing-library/react";

export class Badge {
  public badge: HTMLElement;
  public badgeName: string;

  constructor(badge: HTMLElement, badgeName: string) {
    this.badge = badge;
    this.badgeName = badgeName
  }

  click(): void {
    fireEvent.click(this.badge)
  }

  async getPopup(): Promise<HTMLElement> {
    return screen.findByTestId(`${this.badgeName}-popup`)
  }
}
