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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Auth } from "aws-amplify"
import { withStyles } from '@material-ui/core/styles';
import css from '../css/Header.module.css';
import vcmImage from "../images/vcm5.png" 

const CustomDialog = withStyles(() => ({
  root: {
    '& .MuiDialog-paper': {
      padding: '8px'
    }
  },
}))(Dialog);

const CustomButton = withStyles(() => ({
  root: {
    alignSelf: 'center',
    marginTop: 'auto'
  },
}))(Button);

const DialogButton = withStyles(() => ({
  root: {
    margin: '4px',
  },
}))(Button);

const DialogCenterButton = withStyles(() => ({
  root: {
    margin: '4px',
    alignSelf: 'center'
  },
}))(Button);

const VisibilityIconButton = withStyles(() => ({
  root: {
    padding: '0',
    alignSelf: 'flex-end',
    marginBottom: '4px'
  },
}))(IconButton);

const CustomTextField = withStyles(() => ({
  root: {
    margin: '4px'
  },
}))(TextField);

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
    const { drawerOpen } = this.props
    const buttonStyles = {
      position: 'absolute',
      top: '5px',
      right: drawerOpen ? '8px' : '40px'
    };
    if (this.props.clientId) {
      return (
        <IconButton
          style={buttonStyles}
          size="small"
          variant="outlined"
          onClick={() => this.singOutDialogOpen()}>
          <AccountCircleIcon />
        </IconButton>
      )
    } else {
      return (
        <IconButton
          style={buttonStyles}
          size="small"
          variant="outlined"
          onClick={() => this.singInDialogOpen()}>
          <AccountCircleIcon />
        </IconButton>
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
      <CustomDialog
        open={ singUpDialog }
        onClose={() => this.singUpDialogClose()}>
        <h2 className={css.headerText}>新規アカウント作成</h2>
        <div className={css.dialogWrap}>
          <span className={css.helperText}>作成後、入力したアドレスに確認コードが送られます。</span>
          <CustomTextField
            id="signUpName"
            label="Name"
            required
            error={ signUpNameError }
            helperText={ signUpNameHelperText }
            onChange={event => this.signUpNameValueChange(event)} />
          <div className={css.passwordTextField}>
            <TextField
              id="signUpPassword"
              label="Password"
              required
              type={signUpShowPassword ? 'text' : 'password'}
              error={ signUpPasswordError }
              helperText={ signUpPasswordHelperText }
              onChange={event => this.signUpPasswordValueChange(event)}/>
            <VisibilityIconButton
              aria-label="toggle password visibility"
              onClick={() => this.handleClickShowSignUpPassword()}
              onMouseDown={event => this.handleMouseDownPassword(event)}
              edge="end"
            >
              {signUpShowPassword ? <Visibility /> : <VisibilityOff />}
            </VisibilityIconButton>
          </div>
          <CustomTextField
            id="signUpEmail"
            label="email"
            required
            error={ signUpEmailError }
            helperText={ signUpEmailHelperText }
            onChange={event => this.signUpEmailValueChange(event)}/>
          <div className={css.helperTextRed}>{ signUpHelperText }</div>
        </div>
        <DialogCenterButton
          size="small"
          variant="outlined"
          onClick={() => this.signUp()}
          disabled={ signUpNameError || !signUpName || signUpPasswordError || !signUpPassword || signUpEmailError || !signUpEmail }>
          アカウント作成
        </DialogCenterButton>
      </CustomDialog>
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
      <CustomDialog
        open={ confirmSingUpDialog }
        onClose={() => this.confirmSingUpDialogClose()}>
        <h2 className={css.headerText}>確認コード入力</h2>
        <span className={css.helperText}>確認コードを入力してください。</span>
        <div className={css.dialogWrap}>
          <CustomTextField
            id="confirmSignUpName"
            label="Name"
            required
            onChange={event => this.confirmSignUpNameValueChange(event)}/>
          <CustomTextField
            id="confirmSignUpCode"
            label="Code"
            required
            onChange={event => this.confirmSignUpCodeValueChange(event)}/>
          <div className={css.helperTextRed}>{ confirmSignUpHelperText }</div>
        </div>
        <DialogCenterButton
          size="small"
          variant="outlined"
          onClick={() => this.confirmSignUp()}
          disabled={!confirmSignUpName || !confirmSignUpCode}>
          確認
        </DialogCenterButton>
      </CustomDialog>
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
      <CustomDialog
        open={singInDialog}
        onClose={() => this.singInDialogClose()}>
        <div>
          <h2 className={css.headerText}>サインイン</h2>
          <div className={css.dialogWrap}>
            <CustomTextField
              id="signInName"
              label="Name"
              color="secondary"
              onChange={event => this.signInNameValueChange(event)}/>
            <FormControl style={{ margin: '4px' }}>
              <InputLabel
                htmlFor="signInPassword"
                color="secondary">
                Password
              </InputLabel>
              <Input
                id="signInPassword"
                type={signInShowPassword ? 'text' : 'password'}
                value={signInPassword}
                color="secondary"
                onChange={event => this.signInPasswordValueChange(event)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
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
            <div className={css.helperTextRed}>{ signInHelperText }</div>
          </div>
          <div>
            <DialogButton
              size="small"
              variant="outlined"
              onClick={() => this.signIn()}
              disabled={ !signInName || !signInPassword }>
              サインイン
            </DialogButton>
            <DialogButton
              size="small"
              variant="outlined"
              onClick={() => this.onAccountCreatButton()}>
              新規アカウント作成
            </DialogButton>
            <DialogButton
              size="small"
              variant="outlined"
              onClick={() => this.onAccountConfirmButton()}>
              確認コード入力
            </DialogButton>
          </div>
        </div>
      </CustomDialog>
    )
  }

  renderSingOutDialog () {
    return (
      <CustomDialog
        open={this.state.singOutDialog}
        onClose={() => this.singOutDialogClose()}>
          <div className={css.dialogWrap}>
            <h2 className={css.headerText}>アカウント情報</h2>
            <div className={css.dialogBody}>
              <p className={css.dialogParagraph}>ユーザー名: {this.props.userName}</p>
              <p className={css.dialogParagraph}>ID: {this.props.clientId}</p>
            </div>
            <CustomButton
              variant="outlined"
              size="small"
              onClick={() => this.signOut()}>
              signout
            </CustomButton>
          </div>
      </CustomDialog>
    )
  }

  render () {
    return (
      <div className={css.clearfix}>
        { this.renderAccountButton() }
        { this.renderSingUpDialog() }
        { this.renderConfirmSingUpDialog() }
        { this.renderSingInDialog() }
        { this.renderSingOutDialog() }
        <h1 className={css.header}>
          <img
            src={vcmImage}
            alt="visition cards master"
            className={css.headerImage}
          ></img>
        </h1>
      </div>
    )
  }
}

export default Header
