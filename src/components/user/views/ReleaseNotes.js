import React from "react";
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react";

/** Component provides the informations about
 ** the features available in the various releases.
 **/

class ReleaseNotes extends React.Component {
  render() {
    return (
      <Timeline lineColor={"#26314b"}>
        {/* v13 release */}
        <TimelineItem
          key="001"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v13</h1>
              <label>27/09/2021</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>Layout Changes</li>
            </ol>
            <h6 className="mb-3">Review</h6>
            <ol type="1" className="mb-3">
              <li>Filter competencies by area and type</li>
            </ol>
          </div>
        </TimelineItem>

        {/* v12 release*/}
        <TimelineItem
          key="001"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v12</h1>
              <label>16/08/2021</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>Verified items are restricted for users to edit except the FRAC Admin and Review & Accept board member</li>
              <li>Delete action is enabled only for FRAC Admin and Review & Accept board member</li>
            </ol>
            <h6 className="mb-3">Review</h6>
            <ol type="1" className="mb-3">
              <li>Email notification for the item creator, when the item gets rejected in level 2 review</li>
            </ol>
          </div>
        </TimelineItem>
        {/* Eleventh release*/}
        <TimelineItem
          key="001"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v11</h1>
              <label>03/05/2021</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Dashboard</h6>
            <ol type="1" className="mb-3">
              <li>Videos and FAQs to help in the FRACing process.</li>
              <li>Reviewers dashboard.</li>
            </ol>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>Role based item status and actions buttons for collection items.</li>
            </ol>
            <h6 className="mb-3">Review</h6>
            <ol type="1" className="mb-3">
              <li>Redesigned review page user interface.</li>
              <li>Role based visibility for item status and action buttons.</li>
            </ol>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>New roles - Reviewers, Competency readers apart from FRAC Admin and IFUMember.</li>
              <li>Two level review process.</li>
              <li>Role based access control for newer roles.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Tenth release */}
        <TimelineItem
          key="002"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v10</h1>
              <label>19/04/2021</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Review</h6>
            <ol type="1" className="mb-3">
              <li>Empty states for preview components in review page.</li>
              <li>Verify items without comments.</li>
            </ol>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>MDO dropdown in position page.</li>
              <li>Draft state.</li>
              <li>New action buttons.</li>
              <li>New labels in activity logs.</li>
              <li>Custom filters for Position, Roles and Activities.</li>
              <li>Collaborative editing - Live users lists.</li>
            </ol>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>Color updates based on accessibility.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Ninth release */}
        <TimelineItem
          key="003"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v9</h1>
              <label>04/02/2021</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>New status icons.</li>
              <li>Draft feature.</li>
              <li>Single level creation of competencies.</li>
              <li>Activity logs with comment view.</li>
              <li>Competency level selector.</li>
              <li>
                Reduction of minimum character limit for competency level
                description to 150.
              </li>
            </ol>
            <h6 className="mb-3">Review</h6>
            <ol type="1" className="mb-3">
              <li>Collection selector.</li>
              <li>Activity logs with comment section.</li>
              <li>Feature to provide review comment.</li>
              <li>New status icons.</li>
              <li>
                Enabled review process for Positions, Roles, Activities in
                addition to Competencies.
              </li>
            </ol>
          </div>
        </TimelineItem>

        {/* Eighth release */}
        <TimelineItem
          key="004"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v8</h1>
              <label>04/12/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Dashboard</h6>
            <ol type="1" className="mb-3">
              <li>
                Role and user department based label and collections count.
              </li>
            </ol>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>Competency area feature for competencies.</li>
              <li>
                Filter by feature for filtering competencies by area and its
                type.
              </li>
              <li>Clear search feature for all available search fields.</li>
            </ol>

            <h5 className="mb-3">Review</h5>
            <ol type="1" className="mb-3">
              <li>Clear search feature for all available search fields.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Seventh release */}
        <TimelineItem
          key="005"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v7</h1>
              <label>07/11/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>
                Department filter feature, after user logged in, the department
                filter applied automatically based on the users department.
              </li>
              <li>
                New naming conventions Master List == Collections and Competency
                Dictionary == Review.
              </li>
            </ol>
            <h6 className="mb-3">Collections</h6>
            <ol type="1" className="mb-3">
              <li>
                Comments and Rating feature for Positions, Roles, Activites,
                Competencies and Knowledge Resources.
              </li>
            </ol>

            <h5 className="mb-3">Role Based Access Control - FRACAdmin</h5>
            <ol type="1" className="mb-3">
              <li>Access to Review page.</li>
              <li>Access to change department filters after login.</li>
              <li>
                Access to view and search departments available in the system.
              </li>
              <li>
                Access to change Competency Owning Departments for competencies
                from Collections page as well as from Review page.
              </li>
            </ol>
          </div>
        </TimelineItem>

        {/* Sixth release */}
        <TimelineItem
          key="006"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v6</h1>
              <label>09/10/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Competency Dictionary</h6>
            <ol type="1" className="mb-3">
              <li>New page named "Competency Dictionary" has been added.</li>
              <li>
                Added Un-verified, Verified and Reject feature for manipulating
                competencies created from various sources.
              </li>
              <li>
                Added preview feature along with smart auto search feature to
                get similar nodes.
              </li>
            </ol>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>
                Added tick icon for the verified competencies in the
                Competencies list.
              </li>
            </ol>
            <h6 className="mb-3">Explore</h6>
            <ol type="1" className="mb-3">
              <li>Updated the entire architecture of the components.</li>
              <li>
                Added edit module which enables users to click over a node and
                update the node details.
              </li>
              <li>Added create new node feature.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Fifth release */}
        <TimelineItem
          key="007"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v5</h1>
              <label>18/09/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>
                Added dropdown in the right side column to select mapped items.
              </li>
              <li>Added unmap feature for mapped unassociated items.</li>
            </ol>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>Refactored animation for the loading of list items.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Fourth release */}
        <TimelineItem
          key="008"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v4</h1>
              <label>11/09/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Explore</h6>
            <ol type="1" className="mb-3">
              <li>Added new navigation bar.</li>
              <li>Added Full Screen feature.</li>
              <li>Enabled node selection upto the depth of level 1.</li>
              <li>Added Clear selection feature.</li>
              <li>Added Right column to display the selected node details.</li>
              <li>Added navigation to selected nodes from the right column.</li>
            </ol>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>Updated the tab ordering in Roles and Activities section.</li>
            </ol>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>Added animation for the loading of list items.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Third release */}
        <TimelineItem
          key="009"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v3</h1>
              <label>04/09/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Dashboard</h6>
            <ol type="1" className="mb-3">
              <li>Updated paragraph alignments.</li>
              <li>Fixed spelling mistakes.</li>
              <li>Added FRAC current version number.</li>
            </ol>
            <h6 className="mb-3">Explore</h6>
            <ol type="1" className="mb-3">
              <li>Removed blue outline from toggle button.</li>
              <li>
                Replaced the ColaJS layout of Graph visualization with the COSE
                layout of CytoscapeJS.
              </li>
              <li>
                Refactored Graph visualization and added few features for better
                usability.
              </li>
              <li>Added Fit to screen button and its functions.</li>
              <li>Added Zoom feature using trackpad and mouse wheel.</li>
              <li>Updated Search API to get results based on item’s labels.</li>
            </ol>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>
                Updated add and map item modals in Positions, Roles, Activities,
                Competencies and Knowledge resources pages.
              </li>
              <li>Enabled word based search in all description fields.</li>
              <li>
                Added scroll to view feature, which takes the user to get
                focused on the new item, when the new item button is clicked.
              </li>
              <li>
                Added delete confirmation modal for deleting URLs and files in
                Knowledge resources page.
              </li>
              <li>Usability improvements.</li>
              <li>Enabled mapping of activities to Role.</li>
            </ol>
            <h6 className="mb-3">General</h6>
            <ol type="1" className="mb-3">
              <li>Added link for Feedback form.</li>
              <li>Added link for User guide.</li>
              <li>Added Release notes page.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* Second release */}
        <TimelineItem
          key="010"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v2</h1>
              <label>28/08/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Dashboard</h6>
            <ol type="1" className="mb-3">
              <li>Information icons and messages were added.</li>
            </ol>
            <h6 className="mb-3">Explore</h6>
            <ol type="1" className="mb-3">
              <li>Enabled toggle feature for the button items.</li>
            </ol>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>Spacing updates.</li>
              <li>
                Knowledge resource multiple URLs and files upload feature.
              </li>
              <li>AWS S3 Integration.</li>
              <li>
                Delete feature for Positions, Roles, Activities and Knowledge
                Resources.
              </li>
              <li>Usability improvements.</li>
            </ol>
          </div>
        </TimelineItem>

        {/* First release */}
        <TimelineItem
          key="011"
          dateComponent={
            <div className="left-section-content">
              <h1 className="align-right">v1</h1>
              <label>21/08/2020</label>
            </div>
          }
          style={{ color: "#2E3094" }}
        >
          <div className="right-section-content">
            <h5 className="mb-3">Page wise feature information’s</h5>
            <h6 className="mb-3">Dashboard</h6>
            <ol type="1" className="mb-3">
              <li>Welcome note.</li>
              <li>Status cards.</li>
            </ol>
            <h6 className="mb-3">Explore</h6>
            <ol type="1" className="mb-3">
              <li>Graph visualization.</li>
              <li>Search feature - Based on item’s description.</li>
            </ol>
            <h6 className="mb-3">Master list</h6>
            <ol type="1" className="mb-3">
              <li>
                Create and update features for Positions, Roles, Activities,
                Competencies and Knowledge Resources.
              </li>
              <li>Mapping of roles and activities to positions.</li>
              <li>Mapping of competencies to roles.</li>
              <li>Mapping of knowledge resources to activities.</li>
              <li>Create competency level and its mapping to competency.</li>
              <li>Competency type mapping to competency.</li>
            </ol>
          </div>
        </TimelineItem>
      </Timeline>
    );
  }
}

export default ReleaseNotes;
