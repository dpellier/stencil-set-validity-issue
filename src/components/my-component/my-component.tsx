import { AttachInternals, Component, Host, Method, Prop, Watch, h } from '@stencil/core';

@Component({
  formAssociated: true,
  shadow: true,
  tag: 'my-component',
})
export class MyComponent {
  private inputElement?: HTMLInputElement;

  @AttachInternals() private internals!: ElementInternals;

  @Prop({ mutable: true, reflect: true }) public value: string = null;

  @Method()
  reset() {
    // Here the <input> has not been updated yet as we modify the Prop directly
    this.value = null;
  }

  @Watch('value')
  onValueChange(): void {
    // Here we want to update the internals value and validity using
    // this.internals.setFormValue(value?.toString() ?? '');
    // this.internals.setValidity(...); // with a loop over the inputElement flags to copy its validityState

    // If we arrive from the onInput, <input> is already updated so the value is accurate
    // But if we arrive from the reset Method, the <input> is not yet updated, so the it's still the old validityState
    console.log('onWatch, isValid?', this.inputElement.validity.valid);

    setTimeout(() => {
      // If we delay it, we can see the new expected value
      console.log('onWatch after timeout, isValid?', this.inputElement.validity.valid);
    }, 0);
  }

  private onInput(): void {
    // Here the <input> validityState has been updated already
    console.log('onInput, isValid?', this.inputElement.validity.valid);

    // So the Watch trigger will be able to set the internals validity with the <input> value correctly
    this.value = this.inputElement?.value ?? null;
  }

  render() {
    return (
      <Host>
        <input
          onInput={ (): void => this.onInput() }
          ref={ (el): HTMLInputElement => this.inputElement = el as HTMLInputElement }
          required={ true }
          type="text"
          value={ this.value || '' }>
        </input>
      </Host>
    );
  }
}
