import React from "react";

/**
 * FAQView renders FAQ's
 */

const faqObject = [
  {
    id: "0",
    question:
      "What does the competency-driven engagement (C-DE) process entail?",
    answer:
      "The competency-driven engagement (C-DE) process is the drafting of the dictionaries, directories, and their interrelationships using work allocation orders. In particular, the C-DE process maps the roles, activities, competencies, and knowledge resources of a given position using its work allocation order. There are a series of 12 steps that an individual or a ministry, department, or organisation (MDOs) needs to go through to complete the entire process. MDOs may also choose to map either only roles, activities, and knowledge resources or competencies as per their requirement.",
  },
  {
    id: "1",
    question:
      "How will it benefit my ministry/ department/ organisation (MDO)?",
    answer:
      "Mission Karmayogi aims to enhance the capacity of the Indian state to draw policies and better execute against it. The iGOT Karmayogi platform is envisioned as a democratised, competency-driven solutioning space that all of government, irrespective of level, sector, or geography, can access to improve their career prospects – and, in the process, enhance government execution capabilities. Given that competencies are at the core of this endeavour, the C-DE process will help every official in every MDO to understand the competencies that are required for their position, their existing competency gaps, and the best route to take to close these gaps.",
  },
  {
    id: "2",
    question:
      "As a manager, how can I help my team map the competencies required for their positions?",
    answer:
      "Every manager is encouraged to motivate her/his team to go through the C-DE process (either as a team or individually) and map the roles, activities, competencies, and knowledge resources tied to their position using their work allocation orders. Managers can, for example, hold a two-day C-DE workshop with experts to help her/his officials to understand their competency requirements and gaps. Managers can also incentivise their teams to complete the process on their own, and support them in any manner required. In either scenario, managers should ensure that the team is provided all the resources in advance to go through the process.",
  },
  {
    id: "3",
    question:
      "What resources will be provided before one goes through the competency-driven engagement (C-DE) process?",
    answer:
      "The following resources are provided by the Mission Karmayogi team to individuals/ MDOs going through the C-DE process:",
    subAnswerOne:
      "a) The latest version of the ‘FRAC and everything else of FRACing’ document",
    subAnswerTwo: "b) Modules with short videos on the C-DE process",
    subAnswerThree:
      "After going through these resources, individuals must complete the corresponding assessments to ensure they have fully understood the process. After completing the assessment, they are certified to go ahead with the C-DE process.",
  },
  {
    id: "4",
    question:
      "How will we add to the dictionaries of positions, roles, activities, and competencies, and the directory of knowledge resources?",
    answer:
      "The mapping of positions, roles, activities, competencies, and knowledge resources will happen through two tools: the work allocation tool and the FRAC tool. A user guide with a How-To video will be provided for individuals to understand how to use these tools.",
  },
  {
    id: "5",
    question:
      "How can we use our existing work allocation orders to assist us in this process?",
    answer:
      "Work allocation orders are documents which formally allocate the roles and accountabilities to every government official, usually upon joining. These are allocated by the supervisor or Head of the MDO, and updated as and when necessary. As the C-DE process outlines, the work allocation order can be directly used to derive position and roles. It can indirectly be used to then derive activities and competencies. For example, the ‘Designation’ column serves as the position label (Step 1), while the ‘Work allocated’ column serves as the list of roles (Step 3). Once these are drawn, one can begin creating a list of activities (Step 4) and competencies (Steps 8-12).",
  },
  {
    id: "6",
    question: "What makes a good position description?",
    answer:
      "The position description should answer the following: Why does this position exist in the MDO? What are its overall objectives/purpose? And how does it go about achieving its objectives? For each of the positions listed in Step 1, derived through the work allocation order, a position description of about 140 characters must be detailed.",
  },
  {
    id: "7",
    question:
      "How do I derive my activities from the ‘Work allocated’ column of my work allocation order?",
    answer:
      "There are a number of activities to fulfil each role. Every individual activity is a usually a sequential action taken to contribute towards the role. As outlined in the C-DE process, once the position label (Step 1) and list of roles (Step 3) have been derived using the work allocation order, one can list the steps (usually more than 1) to be carried out in a sequence (Step 4), and answer the ‘what’, ‘when’ and ‘how’ for each role. For example, what are the different activities under Foreign Investment Facilitation?",
  },
  {
    id: "8",
    question: "How can I deduce the competency area for my competency?",
    answer:
      "Competency areas can be defined as the collection of competencies closely related to one another at a knowledge/ subject level. In order to define the competency area, cluster the competency labels you have created in Step 9, and identify the generic area in which these competency labels could be categorised (e.g. technical writing, rules-based copy editing, content writing and editing, research and information synthesis, and report writing will come under the competency area of ‘Noting and Drafting’).",
  },
  {
    id: "9",
    question:
      "How many competency/proficiency levels do I need to have for each competency?",
    answer:
      "The competency level is the proficiency level of the competency. These indicate levels of sophistication of the competency described. Competency levels are progressive in nature and normally given in an ascending order. Thus, Level 2 is a more sophisticated use of that particular competency, when compared to Level 1 and so on. If you are adding the competency in relation to a particular role, you must specify the proficiency level applicable to that role. There are typically anywhere between 3 and 5 levels of proficiency – you must have a minimum of 3.",
  },
];

class FAQView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clearSearchFAQ: false,
      clearSearchInputFAQ: false,
    };
    this.searchFAQ = this.searchFAQ.bind(this);
  }

  componentDidMount() {}

  searchFAQ = () => {
    console.log("Seacrching...");
    // To search for a FAQ's from FAQ list
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputFAQ) {
      this.setState({
        clearSearchFAQ: true,
      });
    } else {
      this.setState({
        clearSearchFAQ: false,
        clearSearchInputFAQ: false,
      });
    }

    input = document.getElementById("faqSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchFAQ: false,
        clearSearchInputFAQ: false,
      });
    }

    if (!this.state.clearSearchInputFAQ) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("faqList");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  render() {
    return (
      <div className="col-12 custom-body-bg pl-0 pr-0 pl-xs-2 pl-sm-2 pl-md-4 pl-lg-5 pl-xl-5 pr-xs-2 pr-sm-2 pr-md-4 pr-lg-5 pr-xl-5 custom-full-height-7">
        <div className="pt-5"></div> 
        <div className="faq-banner-1 ml-0 mr-0 ml-xs-2 ml-sm-2 ml-md-4 ml-lg-5 ml-xl-5 mr-xs-2 mr-sm-2 mr-md-4 mr-lg-5 mr-xl-5"></div>
        <div
          className="pt-4 ml-0 mr-0 pb-5 ml-xs-2 ml-sm-2 ml-md-4 ml-lg-5 ml-xl-5 mr-xs-2 mr-sm-2 mr-md-4 mr-lg-5 mr-xl-5"
          id="faqSection"
        >
          <h1 className="pb-3">Frequently asked questions</h1>
          <div className="row" style={{ marginLeft: "-1.25rem" }}>
            <div
              className="col-xs-12 col-sm-12 col-md-5 col-lg-3 col-xl-3 mb-2 mt-3"
              id="officerBucketsList"
            >
              <input
                type="text"
                className="form-control custom-search-6 custom-search-bar-4"
                placeholder="Search..."
                name="search"
                value={this.keyword}
                onKeyUp={this.searchFAQ}
                id="faqSearch"
                autoComplete="off"
              />
            </div>
            <div className="col-2">
              {this.state.clearSearchFAQ && (
                <span
                  className="material-icons competency-area-close-button-6"
                  onClick={() => {
                    this.setState(
                      {
                        clearSearchInputFAQ: true,
                      },
                      () => {
                        document.getElementById("faqSearch").value = "";
                        this.searchFAQ();
                      }
                    );
                  }}
                >
                  close
                </span>
              )}
            </div>
          </div>
          <div id="faqList">
            {faqObject.map((i, j) => {
              return (
                <div className="faq-box-1 p-3 mt-3" key={j}>
                  <h2 className="pt-2 pl-2 pr-2">{i.question}</h2>
                  {i.answer &&
                    !i.subAnswerOne &&
                    !i.subAnswerTwo &&
                    !i.subAnswerThree && (
                      <label className="pt-2 pl-2 pr-2">{i.answer}</label>
                    )}
                  {i.answer &&
                    i.subAnswerOne &&
                    i.subAnswerTwo &&
                    i.subAnswerThree && (
                      <>
                        <label className="pt-2 pl-2 pr-2">{i.answer}</label>
                        <br />
                        <label className="pt-2 pl-2 pr-2">
                          {i.subAnswerOne}
                        </label>
                        <br />
                        <label className="pt-2 pl-2 pr-2">
                          {i.subAnswerTwo}
                        </label>
                        <label className="pt-2 pl-2 pr-2">
                          {i.subAnswerThree}
                        </label>
                      </>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default FAQView;
