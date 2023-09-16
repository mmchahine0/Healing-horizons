import '../styles/FooterStyles.css'
import fb from "../images/facebook.png"
import TwitterX from "../images/twitter.png"
import insta from "../images/insta.png"

const Footer = () => {

  return (
    <>
      <div className="footer">
        <div className='sb_footer section_padding'>
          <div className='sb_footer-links'>
            
            <div className='sb_footer-links_div'>
             <h4>Resources</h4> 
            <a href="">
                <p>Employee</p>
              </a>
              <a href="">
                <p>health</p>
              </a>
              <a href="">
                <p>individual</p>
              </a>
            </div>
            <div className='sb_footer-links_div'>
              <h4>Partners</h4> 
              <a href="">
                <p>Test</p>
              </a>
              <a href="">
                <p>Test</p>
              </a>
              <a href="">
                <p>Test</p>
              </a>
            </div> 
            <div className='sb_footer-links_div'>
              <h4>Company</h4> 
              <a href="">
                <p>About</p>
              </a>
              <a href="">
                <p>Press</p>
              </a>
              <a href="">
                <p>Carrer</p>
              </a>
              <a href="">
                <p>Contact</p>
              </a>
            </div>
                <div className='sb_footer-links_div'>
                  <h4>Coming on social media</h4> 
                <div className='socialmedia'>
                <p><img style={{ width: "40px", height: "27px", marginTop:"3px" }} src={fb} alt=""/></p>
                <p><img style={{ width: "40px", height: "35px" }} src={TwitterX} alt=""/></p>
                <p><img style={{ width: "35px", height: "32px" }} src={insta} alt=""/></p>
              </div>
             </div>
          </div>
          <hr />
          <div className='sb_footer-below'>
            <div className='sb_footer-copyright'>
              <p>
                @{new Date().getFullYear()} CodeInn. All right reserved.
              </p>
            </div>
            <div className='sb_footer-below-links'>
                <a href=""> <div><p>Terms & Condition</p></div></a>
                <a href=""> <div><p>Privacy</p></div></a>
                <a href=""> <div><p>Security</p></div></a>
                <a href=""> <div><p>Cookie Declaration</p></div></a>

            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default Footer;