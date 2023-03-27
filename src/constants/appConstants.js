export const APP = {
  REQUEST: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
  },
  CODE: {
    SUCCESS: 200
  },
  COLLECTIONS: {
    POSITION: 'POSITION',
    ROLE: 'ROLE',
    ACTIVITY: 'ACTIVITY',
    COMPETENCY: 'COMPETENCY',
    KNOWLEDGE_RESOURCES: 'KNOWLEDGERESOURCE',
    COMPETENCY_LEVEL: 'COMPETENCIESLEVEL'
  },
  COLLECTIONS_PATH: {
    POSITION: '/collection-positions/',
    ROLE: '/collection-roles/',
    ACTIVITY: '/collection-activities/',
    COMPETENCY: '/collection-competencies/',
    KNOWLEDGE_RESOURCES: '/collection-knowledge-resources/'
  },
  ROUTES_PATH: {
    ADMIN: "/admin",
    REVIEW: '/review/',
    REVIEW_POSITION: '/review/position/',
    REVIEW_ROLES: '/review/role/',
    REVIEW_ACTIVITIES: '/review/activity/',
    REVIEW_COMPETENCY: '/review/competency/',
  },
  WORKFLOWS: {
    DASHBOARD: "/workflow-dashboard",
    PEOPLE: "/workflow-people",
    DETAIL: "/workflow-detail",
    LEVEL: "/level",
  },
  FIELD_NAME: {
    NAME: "Name",
    LABEL: "Label",
    DESCRITPION: "Description",
    COMP_TYPE: "Competency type",
    COD: "COD",
    COMP_AREA: "Competency area",
    COMP_LEVEL: "Competency level",
    COMP_SOURCE: "Competency source",
    SECTOR: "Sector",

    MDO: "MDO",
    KR_URL: "KR URL",
    KR_FILE: "KR file"
  },
  NODE_STATUS: {
    UNVERIFIED: "UNVERIFIED",
    VERIFIED: "VERIFIED",
    REJECTED: "REJECTED",
    DRAFT: "DRAFT",
  },
  USER_ROLES: {
    FRAC_ADMIN: "FRAC_ADMIN",
    REVIEWER_ONE: "FRAC_REVIEWER_L1",
    REVIEWER_TWO: "FRAC_REVIEWER_L2"
  },
  PARAMETERS: {
    SIMILAR_ITEM_TAB_REF: "#similar-items-column-six",
    SECTOR: 'SECTOR',
    COMPETENCY_AREA: 'COMPETENCYAREA',
    AREA: 'area',
  }
};
