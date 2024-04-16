import './App.css'
import ItemListContainer from './components/ItemListContainer'
import NavBar from './components/NavBar'

function App() {

  const greeting = 'Bienvenidos a nuestra tienda'

  return (
    <>
      <NavBar />
      <ItemListContainer greeting={ greeting }/>
    </>
  )
}

export default App
