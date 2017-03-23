import { connect } from 'preact-redux'
import { Component } from 'preact'
import { StyledStream } from './styled'

import CypherFrame from './CypherFrame'
import HistoryFrame from './HistoryFrame'
import PlayFrame from './PlayFrame'
import Frame from './Frame'
import PreFrame from './PreFrame'
import ParamsFrame from './ParamsFrame'
import ParamFrame from './ParamFrame'
import ErrorFrame from './ErrorFrame'
import HelpFrame from './HelpFrame'
import SchemaFrame from './SchemaFrame'
import SysInfoFrame from './SysInfoFrame'
import ConnectionFrame from './Auth/ConnectionFrame'
import DisconnectFrame from './Auth/DisconnectFrame'
import UserList from '../User/UserList'
import UserAdd from '../User/UserAdd'
import { getFrames, setRecentView, getRecentView } from 'shared/modules/stream/streamDuck'
import { getRequests } from 'shared/modules/requests/requestsDuck'
import { getActiveConnectionData } from 'shared/modules/connections/connectionsDuck'
import QueriesFrame from './Queries/QueriesFrame'

const getFrame = (type) => {
  const trans = {
    error: ErrorFrame,
    cypher: CypherFrame,
    'user-list': UserList,
    'user-add': UserAdd,
    pre: PreFrame,
    play: PlayFrame,
    'play-remote': PlayFrame,
    history: HistoryFrame,
    param: ParamFrame,
    params: ParamsFrame,
    connection: ConnectionFrame,
    disconnect: DisconnectFrame,
    schema: SchemaFrame,
    help: HelpFrame,
    queries: QueriesFrame,
    sysinfo: SysInfoFrame,
    default: Frame
  }
  return trans[type] || trans['default']
}

class Stream extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.activeConnectionData === nextProps.activeConnectionData &&
      this.props.requests === nextProps.requests &&
      (this.props.children.length === nextProps.children.length &&
        this.props.children.every((child, idx) => {
          return child === nextProps.children[idx]
        })) &&
      (this.props.frames.length === nextProps.frames.length &&
        this.props.frames.every((crFrame, idx) => {
          return crFrame.id === nextProps.frames[idx].id
        }))
    ) {
      return false
    } else {
      return true
    }
  }

  render () {
    return (
      <StyledStream>
        {this.props.frames.map((frame) => {
          const frameProps = {
            frame,
            activeConnectionData: this.props.activeConnectionData,
            request: this.props.requests[frame.requestId],
            recentView: this.props.recentView,
            onRecentViewChanged: (view) => {
              this.props.onRecentViewChanged(view)
            }
          }
          const MyFrame = getFrame(frame.type)
          return <MyFrame {...frameProps} key={frame.id} />
        })}
      </StyledStream>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    frames: getFrames(state),
    requests: getRequests(state),
    activeConnectionData: getActiveConnectionData(state),
    recentView: getRecentView(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onRecentViewChanged: (view) => {
      dispatch(setRecentView(view))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stream)