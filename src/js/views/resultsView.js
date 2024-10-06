import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  #parentElement = document.querySelector('.results');
  #errorMessage = 'No Results Found';
  #message = '';

  #generateMarkup() {
    return this.data.map(result => previewView.render(result, false)).join('')
  }
}
export default new ResultsView;