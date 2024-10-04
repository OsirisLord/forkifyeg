import icons from 'url:../../img/icons.svg'
export default class View {
  #data;
  #parentElement
  #generateMarkup
  #errorMessage
  #message

  render(data, render = true){
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
    this.#data = data;
    const markup = this.#generateMarkup();
    if (!render) return markup;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data){
    this.#data = data;
    const newMarkup = this.#generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const currentElements = Array.from(this.#parentElement.querySelectorAll('*'))
    newElements.forEach((newElement, index) => {
      const currentElement = currentElements[index];
      // Updates changed TEXT
      if (!newElement.isEqualNode(currentElement) && newElement.firstChild?.nodeValue.trim() !== ''){
        currentElement.textContent = newElement.textContent
      }
      // Updates changed ATTRIBUTES
      if (!newElement.isEqualNode(currentElement))
        Array.from(newElement.attributes).forEach(attribute => currentElement.setAttribute(attribute.name, attribute.value))
    })
  }

  #clear(){
    this.#parentElement.innerHTML = ''
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this.#clear()
    this.#parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this.#errorMessage){
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`
    this.#clear()
    this.#parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this.#message){
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`
    this.#clear()
    this.#parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}