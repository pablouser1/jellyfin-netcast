import { Component } from 'preact'
import { getLibraries } from '../services/library'
import store from '../store'
import Item from '../components/Item'

export default class Home extends Component {
  state = {
    libraries: []
  }

  async componentWillMount () {
    const user = store.get('user')
    const res = await getLibraries(user.id)
    this.setState({
      libraries: res.Items
    })
  }

  render () {
    return (
      <section id="home">
        WIP
      </section>
    )
  }
}
