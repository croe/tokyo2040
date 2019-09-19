import React, {useCallback, useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Input, List, ListItem } from '@material-ui/core';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import Modal from 'react-modal';
import QRReader from 'react-qr-reader';
import {transactions, storages, getTestAssets} from "./blockchain";
import _ from 'lodash';

const modalStyles = {
  overlay: {
    position: 'fixed',
    zIndex: "100",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  content: {
    position: 'fixed',
    top: "50%",
    left: "50%",
    width: "300px",
    height: "300px",
    transform: "translate(-50%, -50%)"
  }
};
const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
});

const About = props => {
  const { classes, user, block, tx, store } = props;
  const [infoOpened, setInfoOpened] = useState(false);

  const openInfoModal = useCallback(() => {setInfoOpened(true)}, []);
  const closeInfoModal = useCallback(() => {setInfoOpened(false)}, []);

  const handleScan = data => {
    if (data) {
      console.log(data);
      const tx = {
        blockNumber: block.height,
        to: user.uid,
        input: {
          assetId: data
        }
      };
      console.log(tx);
      getTestAssets(tx);
      closeInfoModal();
    }
  };

  const handleError = err => console.log(err);

  const userStatus = txns => {
    let status = [];
    let st = Object.assign([], store);
    if (txns && st) {
      let testAssets = [];
      st.forEach(doc => {
        testAssets.push(doc.data());
      });
      console.log(testAssets);
      _.filter(txns, function(o){
        if (o.data().to === user.uid) {
          testAssets.forEach(item=>{
            if (item.assetId === o.data().input.assetId) {
              status.push(item);
            }
          })
        }
        return false;
      });
    }
    return status;
  };

  return (
    <React.Fragment>
      <Header user={user} login="/Login/target/about" />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
        <Grid className={classes.caption}>
          <Typography component="h2" variant="h5" gutterBottom>
            カードを受け取る
          </Typography>
          <Button color="primary" onClick={openInfoModal}>reader</Button>
          {/*<Button color="primary" onClick={sendMetaTransaction}>sendTx</Button>*/}
        </Grid>
        <Grid className={classes.caption}>
          <Typography component="h2" variant="h5" gutterBottom>
            自分の状態
          </Typography>
          <List>
            {
              userStatus(tx).map((item, id)=>{
                return (
                  <ListItem key={id}>{item}</ListItem>
                )
              })
            }
          </List>
        </Grid>
      </Grid>
      <Modal
        isOpen={infoOpened}
        style={modalStyles}
      >
        <div>
          <Button onClick={closeInfoModal}>x</Button>
          <QRReader
            delay={300}
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
