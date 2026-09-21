import React from "react";
import styles from"./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <footer className={styles.footerMain}>
        <div className={`container ${styles.footer1}`}>
          <div className={`container-fluid row text-center ${styles.footerItem}`}>
            <div className={`${styles.logo} col`}>Let'play</div>
            <div className={`col`}>
              © Let’s play ONLINE 2017 ALL RIGHT RESERVED
            </div>
            <div className={`col text-uppercase`}>
              TERM & CONDITION
              <br />
              PRIVACY POLICY
              <br />
              HELP
            </div>
            <div className={`col`}>
              <div className={`d-flex justify-content-between fs-2`}>
              <i class="bi bi-facebook"></i>
              <i class="bi bi-twitter-x"></i>
              <i class="bi bi-google"></i>
              <i class="bi bi-instagram"></i>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.footer2} bottom-0 card`}>
            © Let’s play ONLINE 2017 ALL RIGHT RESERVED
        </div>
      </footer>
    </div>
  );
};

export default Footer;
