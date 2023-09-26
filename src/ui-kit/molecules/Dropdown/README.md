# USAGE

## Example 1

```js
<DropDownComponent
  // === REQUIRED PARAMS ===

  inputRefMobile={this.inputRefMobile}
  inputRefDesktop={this.inputRefDesktop}
  // Параметры для контроля работы Input-а
  inputParams={{
    placeholder: 'home_bid_placeholder',
    onChange: (e) => setDescription(e),
    value: description,
    onKeyUp: (e) => this.handleGetDescParts(e),
    onClick: (e) => this.scrollTop(e),
  }}
  // Параметры для контроля работы текущего выбранного элемента из списка DropDown
  activeOptionHandlers={{
    onClick: (e) => this.handleProcessWhenClickCurrentOption(e),
  }}
  // Список всех элементов DropDown
  optionsData={descriptionPartItemsFromBackend}
  // Параметры отображения для устроиств
  desktop
  mobile
  // laptop
  // tablet
  t={t}
  // === OPTIONAL PARAMS (ONE OF CASES) ===

  // [x] CASE 1: Как ссылка
  // Параметры для контроля работы кнопки как ссылки
  linkParams={{
    to: `/newbid?${query}`,
    onClick: this.onClickTrigger,
    label: 'home_create_bid',
  }}

  // [ ] TODO: CASE 2: Как кнопка
  // Параметры для контроля работы кнопки как Buttom(закомментированы за отсутствием)
  // btnParams={{onClick: 'callback', label: 'home_create_bid'}}
/>
```

## Example 2

```js
<DropDownComponent
  inputParams={{
    editable: true,
    value: slot.name,
    placeholder: `Рекомендация ${slotIndex + 1}`,
    onChange: handleNameChange,
  }}
  label={`Рекомендация ${slotIndex + 1}`}
  optionsData={workTypeOptions}
  activeOptionHandlers={{ onClick: handleOptionSelect }}
  t={(t) => t}
  height="small"
  isInputIncorrect={modalErrors.has(`name[${slotIndex}]`) || modalErrors.has(`recommendations[${slotIndex + 1}][name]`)}
  errorMessage={
    (modalErrors.has(`name[${slotIndex}]`) && modalErrors.get(`name[${slotIndex}]`)) ||
    (modalErrors.has(`recommendations[${slotIndex + 1}][name]`) &&
      modalErrors.get(`recommendations[${slotIndex + 1}][name]`))
  }
/>
```
