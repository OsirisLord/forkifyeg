import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg';

class BookmarksView extends View {
  #parentElement = document.querySelector('.bookmarks__list');
  #errorMessage = 'No bookmarks Found';
  #message = '';

  addHandlerRender(handler){
    window.addEventListener('load', handler)
  }

  #generateMarkup() {
    return this.data.map(bookmark => previewView.render(bookmark, false)).join('')
  }
}
export default new BookmarksView()