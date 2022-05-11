const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload
  scalar Date

  type Query {
    me: Me
    live: VideoWidget
    partner: Partner
    projects: [Project]!
    videoWidgets(projectId: String!): [VideoWidget]!
    videoWidget(id: String!): VideoWidget!
    verifyToken(token: String!): VerifyToken!
    users: [Users!]!
    partners: [Partners!]!
    partnerConnectedUsers(
      page: Int!
      limit: Int!
      currentPage: Int!
    ): partnerConnectedUsers!
    userPaymentInfo(
      id: String!
      page: Int!
      limit: Int!
      currentPage: Int!
    ): userPaymentInfo!
    usersPaymentsInfo(
      page: Int!
      limit: Int!
      currentPage: Int!
    ): userPaymentInfo!
  }

  type Mutation {
    registration(form: IUser!): String!
    registrationPartner(form: IPartner!): String!
    login(form: IUser!): Login!
    logoutLive(fcmToken: String!): Boolean!
    addFcmToken(fcmToken: String!): Boolean!
    loginLive(form: ILive!): String!
    uploadAvatar(avatar: Upload!): Boolean!
    loginPartner(form: IPartner!): LoginPartner!
    logout(token: String!): Boolean!
    project(form: IProject!): Project!
    currentProject(id: String!): Project!
    videoWidget(form: IVideoWidget!): VideoWidget!
    deleteVideoWidget(id: String!): VideoWidget!
    updateVideoWidget(id: String!, form: IVideoWidget!): VideoWidget
    restorePassword(email: String!, password: String!): String!
    restorePasswordPartner(email: String!, password: String!): String!
    confirmPassword(email: String!): Boolean!
    confirmPasswordPartner(email: String!): Boolean!
    dropPassword(password: String!, newPassword: String!): Boolean!
    initPayment(form: IInitPayment!): String!
    updateTariff: Boolean!
    updatePartner(form: IUpdatePartner!): Partner!
    updatePromocode(promocode: String!): Boolean!
  }

  input IInitPayment {
    userId: String!
    amount: Int!
    description: String
  }

  input IProject {
    site: String!
    widgetType: Int!
  }

  input IVideoWidget {
    projectId: String
    type: Int
    location: [String!]
    staButton: Boolean
    staText: String
    staLink: String
    name: String
    position: String
    mainColor: String
    textColor: String
    utmLabel: String
    videos: [Upload!]
    online: Boolean
    host: String
    login: String
    password: String
  }

  input IUser {
    name: String
    email: String!
    password: String!
    promocode: String
  }

  input ILive {
    login: String!
    password: String!
    fcmToken: String!
  }

  input IPartner {
    name: String
    email: String!
    nameOfOrganization: String
    inn: String
    password: String!
  }

  input IUpdatePartner {
    email: String!
    promocode: String
    activated: Boolean
    partnerAccural: Int
    discontDuration: Date
    discontSize: Int
    referralAccural: Int
    balance: Int
  }

  type Users {
    user: User!
    tariff: Tariff
    currentProject: Project
    payment: Payment
    partnerInfo: Partner
  }

  type partnerConnectedUsers {
    users: [Users!]!
    totalUsersCount: Int!
    currentPage: Int!
  }

  type Partners {
    id: String!
    name: String!
    email: String!
    nameOfOrganization: String
    inn: String
    createdAt: Date
    promocode: String
    activated: Boolean
    partnerAccural: Int
    discontDuration: String
    discontSize: Int
    referralAccural: Int
    balance: Int
  }

  type Payment {
    amount: Int!
  }

  type VerifyToken {
    ok: Boolean!
    email: String!
  }

  type Project {
    _id: String!
    userId: String!
    site: String!
    widgetType: Int!
  }

  type VideoWidget {
    _id: String!
    projectId: String!
    userId: String!
    type: Int!
    location: [String!]!
    staButton: Boolean!
    staText: String
    staLink: String
    name: String!
    position: String!
    mainColor: String!
    textColor: String
    utmLabel: String
    videos: [Video!]
    createdAt: String!
    tariffType: Int
    online: Boolean
    host: String
    login: String
    password: String
    fcmToken: [String]
    avatar: Video!
  }

  type Video {
    id: String!
    filename: String!
    mimetype: String!
    path: String!
  }

  type Login {
    token: String!
    me: Me!
  }

  type LoginPartner {
    token: String!
    partner: Partner!
  }

  type Me {
    user: User!
    currentProject: Project
    tariff: Tariff!
  }

  type Tariff {
    userId: String!
    type: Int!
    trial: Boolean!
    expired: String!
    balance: Int!
    createdAt: Date
  }

  type User {
    id: String!
    name: String!
    email: String!
    admin: Boolean!
    createdAt: Date
    promocode: String
    discont: Int
  }

  type Partner {
    id: String!
    name: String!
    email: String!
    nameOfOrganization: String
    inn: String
    createdAt: Date
    promocode: String
    activated: Boolean
    partnerAccural: Int
    discontDuration: String
    discontSize: Int
    referralAccural: Int
    balance: Int
  }

  type userInfo {
    payment: Int
    user: User!
    promocode: String
    tariff: Tariff
    paymentDate: Date
    partnerAccural: Int
    discontSize: Int
  }

  type userPaymentInfo {
    users: [userInfo!]
    totalUsersCount: Int!
    currentPage: Int!
  }
`;
