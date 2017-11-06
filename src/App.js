import React from 'react';
import { Route, Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI'
import './App.css';
import Header from './Header';
import Bookshelf from './Bookshelf';
import Search from './Search';

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  };

  moveBook = (shelf, book) => BooksAPI.update(book, shelf)
    .then(() => {
      this.removeFromShelf(book);
      this.addToShelf(shelf, book);
    });

  removeFromShelf = (book) => {
    const {shelf, id} = book;

    if (shelf === 'currentlyReading') {
      this.removeFromCurrentlyReading(id);
    } else if (shelf === 'wantToRead') {
      this.removeFromWantToRead(id);
    } else if (shelf === 'read') {
      this.removeFromRead(id);
    }
  };

  addToShelf = (shelf, book) => {
    if (shelf === 'currentlyReading') {
      this.addToCurrentlyReading(book);
    } else if (shelf === 'wantToRead') {
      this.addToWantToRead(book);
    } else if (shelf === 'read') {
      this.addToRead(book);
    }
  }

  removeFromCurrentlyReading = (id) => {
    this.setState((prevState) => ({
      currentlyReading: prevState.currentlyReading.filter(book => book.id !== id)
    }));
  };

  addToCurrentlyReading = (book) => {
    this.setState((prevState) => ({
      currentlyReading: prevState.currentlyReading.concat([book])
    }));
  };

  removeFromWantToRead = (id) => {
    this.setState((prevState) => ({
      wantToRead: prevState.wantToRead.filter(book => book.id !== id)
    }));
  };

  addToWantToRead = (book) => {
    this.setState((prevState) => ({
      wantToRead: prevState.wantToRead.concat([book])
    })); 
  };

  removeFromRead = (id) => {
    this.setState((prevState) => ({
      read: this.state.read.filter(book => book.id !== id)
    }));
  };

  addToRead = (book) => {
    this.setState((prevState) => ({
      read: prevState.read.concat([book])
    }));
  };

  componentDidMount() {
    let sortBooks;

    BooksAPI.getAll().then((books) => {
      sortBooks(books);
    });

    sortBooks = (books) => {
      this.setState(() => {
        return {
          currentlyReading: books.filter((book) => book.shelf === 'currentlyReading'),
          wantToRead: books.filter((book) => book.shelf === 'wantToRead'),
          read: books.filter((book) => book.shelf === 'read'),
        };
      });
    };
  }

  render() {
    const CATEGORIES = {
      READING: 'Reading',
      WANT_TO_READ: 'Want to Read',
      READ: 'Read'
    };

    const {currentlyReading, wantToRead, read} = this.state;

    return (
      <div className="app">
        <Route exact path="/search" render={() => (
          <Search moveBook={this.moveBook} />
        )} />
        <Route exact path="/" render={() => (
          <div className="list-books">
            <Header />
            <div className="list-books-content">
              <Bookshelf category={CATEGORIES.READING} books={currentlyReading} moveBook={this.moveBook} />
              <Bookshelf category={CATEGORIES.WANT_TO_READ} books={wantToRead} moveBook={this.moveBook} />
              <Bookshelf category={CATEGORIES.READ} books={read} moveBook={this.moveBook} />
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    );
  }
}

export default BooksApp;
