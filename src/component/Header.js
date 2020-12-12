import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';
import { Auth } from "aws-amplify"

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authState: props.authState || null,
      authData: props.authData || null,
      singUpDialog: false,
      singInDialog: false,
      singOutDialog: false,
      confirmSingUpDialog: false,
      signInName: '',
      signInPassword: '',
      signInHelperText: '',
      signInShowPassword: false,
      signUpName: '',
      signUpPassword: '',
      signUpEmail: '',
      signUpHelperText: '',
      signUpNameError: false,
      signUpNameHelperText: '',
      signUpPasswordError: false,
      signUpPasswordHelperText: '',
      signUpEmailError: false,
      signUpEmailHelperText: '',
      signUpShowPassword: false,
      confirmSignUpName: '',
      confirmSignUpCode: '',
      confirmSignUpHelperText: ''
    }
  }

  getUserData = async () => {
    try {
      const currentSession = await Auth.currentSession()
      const username = currentSession.getAccessToken().payload.username
      const clientId = currentSession.getAccessToken().payload.client_id
      this.setState({
        userData: {
          'username': username,
          'clientId': clientId
        }
      });
      this.props.setUserData(clientId)
    } catch {
      console.log('no user data');
    }
  }

  accountInputReset () {
    this.setState({
      signInName: '',
      signInPassword: '',
      signUpName: '',
      signInShowPassword: false,
      signUpPassword: '',
      signUpEmail: '',
      signUpNameError: false,
      signUpPasswordError: false,
      signUpEmailError: false,
      signUpNameHelperText: '',
      signUpPasswordHelperText: '',
      signUpEmailHelperText: '',
      signUpShowPassword: false,
      signInHelperText: '',
      signUpHelperText: '',
      confirmSignUpHelperText: '',
      confirmSignUpName: '',
      confirmSignUpCode: ''
    });
  }

  singUpDialogOpen () {
    this.setState({ singUpDialog: true })
  }

  singUpDialogClose () {
    this.accountInputReset()
    this.setState({ singUpDialog: false })
  }

  confirmSingUpDialogOpen() {
    this.setState({ confirmSingUpDialog: true })
  }

  confirmSingUpDialogClose() {
    this.accountInputReset()
    this.setState({ confirmSingUpDialog: false })
  }

  singInDialogOpen () {
    this.setState({ singInDialog: true })
  }

  singInDialogClose () {
    this.accountInputReset()
    this.setState({ singInDialog: false })
  }

  singOutDialogOpen () {
    this.setState({ singOutDialog: true })
  }

  singOutDialogClose () {
    this.setState({ singOutDialog: false })
  }

  signOut = async () => {
    try {
      await Auth.signOut();
      this.props.setUserData();
      this.setState({ singOutDialog: false });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  signIn = async () => {
    const { signInName, signInPassword } = this.state
    try {
      const user = await Auth.signIn(signInName, signInPassword);
      this.accountInputReset();
      this.props.setUserData(user.username, user.pool.clientId);
      this.setState({ singInDialog: false });
    } catch (error) {
      console.log('error: ', error);
      this.setState({ signInHelperText: error.message });
    }
  }

  signUp = async () => {
    const { signUpName, signUpPassword, signUpEmail } = this.state
    try {
      await Auth.signUp({
        username: signUpName,
        password: signUpPassword,
        attributes: { email: signUpEmail }
      });
      this.accountInputReset();
      this.setState({
        singUpDialog: false,
        confirmSingUpDialog: true
      });
    } catch (error) {
      console.log('error: ', error);
      this.setState({ signUpHelperText: error.message });
    }
  }

  confirmSignUp = async () => {
    const { confirmSignUpName, confirmSignUpCode } = this.state
    try {
      await Auth.confirmSignUp(confirmSignUpName, confirmSignUpCode);
      this.accountInputReset();
      this.setState({
        confirmSingUpDialog: false,
        singInDialog: true
      });
    } catch (error) {
      console.log('error: ', error);
      this.setState({ confirmSignUpHelperText: error.message });
    }
  }

  signInPasswordValueChange (event) {
    this.setState({ signInPassword: event.target.value });
  };

  signInNameValueChange (event) {
    this.setState({ signInName: event.target.value });
  }

  signUpNameValueChange (event) {
    if (event.target.value.length === 0) {
      this.setState({
        signUpNameError: true,
        signUpNameHelperText: 'name is required'
      });
    } else {
      this.setState({
        signUpNameError: false,
        signUpNameHelperText: ''
      });
    }
    this.setState({ signUpName: event.target.value });
  }

  signUpPasswordValueChange (event) {
    const passwordExp = /^([a-zA-Z0-9!-/:-@¥[-`{-~]{6,})+$/
    if (passwordExp.test(event.target.value)) {
      this.setState({
        signUpPasswordError: false,
        signUpPasswordHelperText: ''
      });
    } else {
      this.setState({
        signUpPasswordError: true,
        signUpPasswordHelperText: '6文字以上にしてください'
      });
    }

    if (event.target.value.length === 0) {
      this.setState({
        signUpPasswordError: true,
        signUpPasswordHelperText: 'password is required'
      });
    }
    this.setState({ signUpPassword: event.target.value });
  }

  signUpEmailValueChange (event) {
    const emailExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    if (emailExp.test(event.target.value)) {
      this.setState({
        signUpEmailError: false,
        signUpEmailHelperText: ''
      });
    } else if (event.target.value.length === 0) {
      this.setState({
        signUpEmailError: true,
        signUpEmailHelperText: 'email is required'
      });
    } else {
      this.setState({
        signUpEmailError: true,
        signUpEmailHelperText: 'email format error'
      });
    }

    this.setState({ signUpEmail: event.target.value });
  }

  confirmSignUpNameValueChange (event) {
    this.setState({ confirmSignUpName: event.target.value });
  }

  confirmSignUpCodeValueChange (event) {
    this.setState({ confirmSignUpCode: event.target.value });
  }

  handleClickShowSignInPassword () {
    this.setState({ signInShowPassword: !this.state.signInShowPassword });
  };

  handleClickShowSignUpPassword () {
    this.setState({ signUpShowPassword: !this.state.signUpShowPassword });
  };

  onAccountCreatButton () {
    this.setState({
      singInDialog: false,
      singUpDialog: true,
    });
  };

  onAccountConfirmButton () {
    this.setState({
      singInDialog: false,
      confirmSingUpDialog: true,
    });
  };

  handleMouseDownPassword (event) {
    event.preventDefault();
  };

  renderAccountButton () {
    if (this.props.clientId) {
      return (
        <Button
          variant="outlined"
          onClick={() => this.singOutDialogOpen()}>
          account
        </Button>
      )
    } else {
      return (
        <Button
          variant="outlined"
          onClick={() => this.singInDialogOpen()}>
          account
        </Button>
      )
    }
  }
  
  renderSingUpDialog () {
    const {
      singUpDialog,
      signUpName,
      signUpNameError,
      signUpNameHelperText,
      signUpPassword,
      signUpPasswordError,
      signUpPasswordHelperText,
      signUpEmail,
      signUpEmailError,
      signUpEmailHelperText,
      signUpHelperText,
      signUpShowPassword
    } = this.state

    return (
      <Dialog
        open={ singUpDialog }
        onClose={() => this.singUpDialogClose()}>
        <div style={{ margin: '8px'}}>
          <h2>sing up</h2>
          <span>作成後、入力したアドレスに確認コードが送られます。</span>
          <div
            style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="signUpName"
              label="name"
              required
              error={ signUpNameError }
              helperText={ signUpNameHelperText }
              onChange={event => this.signUpNameValueChange(event)}/>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <TextField
                  id="signUpPassword"
                  label="password"
                  required
                  type={signUpShowPassword ? 'text' : 'password'}
                  error={ signUpPasswordError }
                  helperText={ signUpPasswordHelperText }
                  onChange={event => this.signUpPasswordValueChange(event)}/>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => this.handleClickShowSignUpPassword()}
                  onMouseDown={event => this.handleMouseDownPassword(event)}
                  style={{ marginTop: '8px' }}
                  edge="end"
                >
                  {signUpShowPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Grid>
            </Grid>
            <TextField
              id="signUpEmail"
              label="email"
              required
              error={ signUpEmailError }
              helperText={ signUpEmailHelperText }
              onChange={event => this.signUpEmailValueChange(event)}/>
          </div >
          <div style={{ color: '#f44336', margin: '4px' }}>{ signUpHelperText }</div>
          <Button
            style={{ margin: '4px' }}
            variant="outlined"
            onClick={() => this.signUp()}
            disabled={ signUpNameError || !signUpName || signUpPasswordError || !signUpPassword || signUpEmailError || !signUpEmail }>
            creat account
          </Button>
        </div>
      </Dialog>
    )
  }

  renderConfirmSingUpDialog () {
    const {
      confirmSingUpDialog,
      confirmSignUpName,
      confirmSignUpCode,
      confirmSignUpHelperText
    } = this.state
    return (
      <Dialog
        open={ confirmSingUpDialog }
        onClose={() => this.confirmSingUpDialogClose()}>
        <div style={{ margin: '8px'}}>
          <h2>confirm sing up</h2>
          <span>確認コードを入力してください。</span>
          <div
            style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="confirmSignUpName"
              label="name"
              required
              onChange={event => this.confirmSignUpNameValueChange(event)}/>
            <TextField
              id="confirmSignUpCode"
              label="code"
              required
              onChange={event => this.confirmSignUpCodeValueChange(event)}/>
          </div >
          <div style={{ color: '#f44336', margin: '4px' }}>{ confirmSignUpHelperText }</div>
          <Button
            style={{ margin: '4px' }}
            variant="outlined"
            onClick={() => this.confirmSignUp()}
            disabled={!confirmSignUpName || !confirmSignUpCode}>
            confirm
          </Button>
        </div>
      </Dialog>
    )
  }

  renderSingInDialog () {
    const {
      singInDialog,
      signInName,
      signInPassword,
      signInShowPassword,
      signInHelperText
    } = this.state
    return (
      <Dialog
        open={singInDialog}
        onClose={() => this.singInDialogClose()}>
        <div style={{ margin: '8px'}}>
          <h2>sing in</h2>
          <div
            style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="signInName"
              label="name"
              onChange={event => this.signInNameValueChange(event)}/>
            <FormControl style={{ margin: '4px' }}>
              <InputLabel htmlFor="signInPassword">Password</InputLabel>
              <Input
                id="signInPassword"
                type={signInShowPassword ? 'text' : 'password'}
                value={signInPassword}
                onChange={event => this.signInPasswordValueChange(event)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => this.handleClickShowSignInPassword()}
                      onMouseDown={event => this.handleMouseDownPassword(event)}
                      edge="end"
                    >
                      {signInShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div >
          <div style={{ color: '#f44336', margin: '4px' }}>{ signInHelperText }</div>
          <Button
            style={{ margin: '4px' }}
            variant="outlined"
            onClick={() => this.signIn()}
            disabled={ !signInName || !signInPassword }>
            sign in
          </Button>
          <Button
            style={{ margin: '4px' }}
            variant="outlined"
            onClick={() => this.onAccountCreatButton()}>
            new account
          </Button>
          <Button
            style={{ margin: '4px' }}
            variant="outlined"
            onClick={() => this.onAccountConfirmButton()}>
            confirm singUp
          </Button>
        </div>
      </Dialog>
    )
  }

  renderSingOutDialog () {
    return (
      <Dialog
        open={this.state.singOutDialog}
        onClose={() => this.singOutDialogClose()}>
          <div style={{ margin: '8px'}}>
          <h2>account Info</h2>
          <h3>name: {this.props.userName}</h3>
          <h3>ID: {this.props.clientId}</h3>
          <Button
            variant="outlined"
            onClick={() => this.signOut()}>
            signout
          </Button>
        </div>
      </Dialog>
    )
  }

  componentDidMount () {
    // this.getUserData()
  }

  render () {
    return (
      <div>
        { this.renderAccountButton() }
        { this.renderSingUpDialog() }
        { this.renderConfirmSingUpDialog() }
        { this.renderSingInDialog() }
        { this.renderSingOutDialog() }
        <h1>vision cards master</h1>
      </div>
    )
  }
}

export default Header
