import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | MEIDEN T&D (INDIA) LIMITED',
  description: 'Our policy regarding the acquisition, management, and utilization of personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Home
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="font-semibold text-brand-primary">Privacy Policy</span>
      </nav>

      {/* Page Title */}
      <div className="mb-10 border-b border-gray-200 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
          Privacy Policy
        </h1>
      </div>

      {/* 
        Main Content 
        'prose-brand' -> Brand Colors & Fonts
        'text-justify' -> Your specific requirement
        'max-w-none' -> Full width text
      */}
      <div className="prose-brand prose-lg max-w-none text-justify">
        
        {/* SECTION 1: Basic Policy */}
        <div className="mb-12">
          <h2 className="flex items-center text-2xl font-bold text-brand-secondary mb-6 border-b border-gray-200 pb-2">
            <span className="text-brand-bright mr-2 text-3xl">1.</span> Basic policy
          </h2>
          <p>
            Meiden T&D India limited (&quot;we/us/our&quot;) understands that properly handling and managing information which could identify specific individuals (&quot;Personal Data&quot;) is socially expected and an important responsibility of a company as it aims to engage in fair and good faith corporate activities, as well as being necessary in order for a company to strictly comply with the Act on the Protection of Personal Information. Therefore, in an effort to strengthen the relationship of trust between us and society as a whole, and in an effort to fulfill its social obligations, we promulgates this privacy policy (&quot;Privacy Policy&quot;), and will handle Personal Data in accordance with this Privacy Policy.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(1) Acquisition of Personal Data</h4>
          <p>
            When you visit our website, our web servers automatically record the IP address of your Internet service provider, the website from which you visit us, the pages on our website you visit and the date and duration of your visit. This information is absolutely necessary for the technical transmission of the web pages and the secure server operation. A personalized evaluation of this data does not take place.
          </p>
          <p>
            If you send us data via contact form, this data will be stored on our servers in the course of data backup. Your data will only be used by us to process your request. Your data will be treated strictly confidential. Your data will not be passed on to third parties.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(2) Management of Personal Data</h4>
          <p>
            Personal data is data about your person. This includes your name, address and email address. You also do not need to provide any personal information to visit our website. In some cases we need your name and address as well as further information to be able to offer you the desired service.
          </p>
          <p>
            The same applies in the event that we supply you with information material on request or when we answer your enquiries. In these cases we will always point this out to you. In addition, we only store data that you have transmitted to us automatically or voluntarily.
          </p>
          <p>
            When you use one of our services, we usually only collect the information that is necessary to provide you with our service. We may ask you for further information, which is voluntary in nature. Whenever we process personal information, we do so in order to provide you with our service or to pursue our commercial purposes. The data collected for the purpose of processing the inquiries and which are not in a business relationship will be deleted within one year.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(3) Utilization of Personal Data</h4>
          <p>
            When acquiring Personal Data, we will clarify the intended purpose of the utilization of the information, and use the information only to the extent necessary for achieving this purpose and performing our business.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(4) Provision of Personal Data</h4>
          <p>We will not disclose or provide Personal Data to any third parties except in the following cases:</p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>When the affected person has given prior consent to the disclosure of his/her Personal Data;</li>
            <li>When disclosure of such Personal Data is necessary to protect human life, safety, or property, but where it is difficult to obtain permission from the affected person for the use of such person&apos;s Personal Data;</li>
            <li>When complying with laws and regulations;</li>
            <li>When entrusting the handling of Personal Data to a third party to the extent that it is necessary to achieve the purpose intended in the usage of such Personal Data. In such case, we shall exercise necessary and appropriate supervision over the entrustee to ensure the secure control of the entrusted Personal Data;</li>
            <li>When sharing Personal Data with our group companies, sales agents, or other companies, and where the joint use of said Personal Data is necessary to achieve the purpose intended in the usage of such Personal Data. In such case, we will assume responsibility for managing the Personal Data; and</li>
            <li>When another entity succeeds to our business due to a merger, corporate separation, transfer of business, or otherwise.</li>
          </ol>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(5) Response to Requests Relating to Personal Data</h4>
          <p>
            We will respond promptly and in accordance with relevant laws and regulations to requests relating to Personal Data, including requests for the disclosure, correction, addition, deletion, cessation of use, or purge of Personal Data.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(6) Implementation, Improvement and Revision of the Privacy Policy</h4>
          <p>
            In order to strictly comply with the Act on the Protection of Personal Information and related ordinances, guidelines set out by the government, and other relevant rules and regulations, and to implement the Privacy Policy, we will establish internal rules and regulations, etc., in addition to the Privacy Policy, and will ensure that all our employees and other persons concerned recognize the importance of such rules and regulations and comply with them, while continuously reviewing and improving the same.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(7) Inquiries Concerning Personal Data</h4>
          <div className="overflow-x-auto border border-gray-200 rounded-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-brand-secondary bg-gray-50 w-1/4">Mailing address</td>
                  <td className="px-6 py-4 text-gray-700">
                    MEIDEN T&D (INDIA) LIMITED Building No. 10. Tower C, 1st Floor, DLF Cyber City, Phase - II, Gurgaon-122002, Haryana, India
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-brand-secondary bg-gray-50">Telephone</td>
                  <td className="px-6 py-4 text-gray-700">+91-124-4549830</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Personal Data Regarding Users */}
        <div className="mb-12">
          <h2 className="flex items-center text-2xl font-bold text-brand-secondary mb-6 border-b border-gray-200 pb-2">
            <span className="text-brand-bright mr-2 text-3xl">2.</span> Personal Data Regarding our Website Users
          </h2>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(1) Acquisition of Personal Data</h4>
          <p>The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Date and time of the request</li>
            <li>Page from which the file was requested</li>
            <li>Access status (file transferred, file not found, etc.)</li>
            <li>Web browser and operating system used</li>
            <li>Complete IP address of the requesting computer</li>
            <li>Transferred data volume</li>
          </ul>
          <p>
            These data will not be merged with other data sources. Processing takes place in accordance with Art. 6 Para. 1 (f) EU GDPR on the basis of our legitimate interest in improving the stability and functionality of our website.
          </p>
          <p>
            For reasons of technical security, in particular to prevent attempts to attack our web server, we store these data briefly. It is not possible for us to draw conclusions about individual persons on the basis of these data. After seven days at the latest, these data are made anonymous at domain level by shortening the IP address so that it is no longer possible to establish a reference to the individual user. In addition, these data are processed anonymously for statistical purposes; these are not compared with other data or passed on to third parties, even in extracts.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(2) Utilization of Personal Data</h4>
          <p>
            Personal Data offered by you will be utilized by us within the scope of the stated purpose of the utilization with which you have agreed. If we want to utilize your Personal Data beyond this scope, we will give prior notice to you of the purpose and scope of the proposed utilization, and by doing so will be deemed to have obtained your consent.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(3) Utilization of Cookie</h4>
          <p>
            When you visit our website, we may store information on your computer in the form of cookies. Cookies are small files that are transferred from an Internet server to your browser and stored on its hard drive. Only the Internet protocol address is stored here - no personal data. This information, which is stored in the cookies, allows you to be automatically recognized the next time you visit our website, which makes it easier for you to use. The legal basis for the use of cookies is the legitimate interest pursuant to Art. 6 Para. 1 (f) EU GDPR.
          </p>
          <p>
            Of course you can also visit our website without accepting cookies. If you do not want your computer to be recognized during your next visit, you can also refuse the use of cookies by changing the settings in your browser to &quot;refuse cookies&quot;. The respective procedure can be found in the operating instructions of your browser. If you reject the use of cookies, however, there may be restrictions in the use of some areas of our website.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(4) Utilization of Google Tag Manager</h4>
          <p>
            This website uses Google Tag Manager. The Tag Manager does not collect personally identifiable information. The tool triggers other tags that may themselves collect information. Google Tag Manager does not access this information. If deactivation has been made at the domain or cookie level, it will persist for all tracking tags implemented with Google Tag Manager. Google&apos;s privacy policy for this tool can be found here:
          </p>
          <p>
            <a href="https://www.google.com/analytics/terms/tag-manager/" target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-primary hover:underline">
              https://www.google.com/analytics/terms/tag-manager/ <ExternalLink size={16} className="ml-2" />
            </a>
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(5) Utilization of Google Analytics</h4>
          <p>We use Google Analytics, a web analysis service provided by Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 USA, hereinafter referred to as &quot;Google&quot;, on our website. Google Analytics uses &quot;cookies&quot;, which are text files placed on your computer, to help the website analyze how users use the site.</p>
          <p>The information generated by these cookies, such as the time, place and frequency of your website visit including your IP address, is transmitted to Google in the USA and stored there.</p>
          <p>We use Google Analytics with the addition &quot;_gat._anonymizeIp&quot; on our website. In this case, your IP address will already be shortened by Google within member states of the European Union or in other contracting states of the Agreement on the European Economic Area and thus made anonymous.</p>
          <p>Google will use this information for the purpose of evaluating your use of our website, compiling reports on website activity for us and providing other services relating to website activity and internet usage. Google may also transfer this information to third parties where required to do so by law, or where such third parties process the information on behalf of Google.</p>
          <p>According to its own specifications, Google will not associate your IP address with any other data held by Google. You may refuse the use of cookies by selecting the appropriate settings on your browser, however please note that if you do this you may not be able to use the full function of our website.</p>
          <p>
            In addition, Google offers a deactivation add-on for the most common browsers, which gives you more control over which data Google collects about the websites you visit. The add-on tells Google Analytics&apos; JavaScript (ga.js) that no website visit information should be transmitted to Google Analytics. However, the deactivation add-on for browsers of Google Analytics does not prevent information from being transmitted to us or to other web analysis services we may use. For further information on installing the Browser Add-on, please click on the following link:
            <br/>
            <a href="https://tools.google.com/dlpage/gaoptout?hl=en-GB" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-primary hover:underline mt-1">
              https://tools.google.com/dlpage/gaoptout?hl=en-GB <ExternalLink size={14} className="ml-1" />
            </a>
          </p>
          <p>
            If you visit our site via a mobile device (smartphone or tablet), you must <span className="text-brand-primary underline cursor-pointer">click this link (Opt-out)</span> instead to prevent Google Analytics from tracking you within this site in the future. This is also possible as an alternative to the browser add-on above. Clicking the link will set an opt-out cookie in your browser that is only valid for that browser and that domain.
          </p>
          <p>If you have consented to your web and app browsing history being linked to your Google Account by Google and information from your Google Account being used to personalize advertisements, Google will use your information in conjunction with Google Analytics data to create cross-device remarketing audience lists. Google Analytics first collects on our website your Google-authenticated ID, which is associated with your Google Account (i.e., personal information). Google Analytics will then temporarily associate your ID with your Google Analytics data in order to optimize our target audiences.</p>
          <p>If you don&apos;t agree, you can turn it off by making the appropriate settings in the My Account section of your Google Account.</p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(6) Utilization of SPIRAL</h4>
          <p>We use the SPIRAL online database service provided by PIPED BITS Co., Ltd. as an entry form which we use to make personal information available from you.</p>
          <p>The information and privacy policy of PIPED BITS Co., Ltd. relating to this tool can be found here:</p>
          
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-bold text-brand-secondary">Privacy policy</dt>
              <dd>
                <a href="https://www.pi-pe.co.jp/company/management/privacy/" target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-primary hover:underline">
                  https://www.pi-pe.co.jp/company/management/privacy/ <ExternalLink size={16} className="ml-2" />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-brand-secondary">Management system</dt>
              <dd>
                <a href="https://www.pi-pe.co.jp/company/managementsystem/" target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-primary hover:underline">
                  https://www.pi-pe.co.jp/company/managementsystem/ <ExternalLink size={16} className="ml-2" />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-brand-secondary">Data security</dt>
              <dd>
                <a href="https://www.pi-pe.co.jp/spiral-series/spiral-suite/security/" target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-primary hover:underline">
                  https://www.pi-pe.co.jp/spiral-series/spiral-suite/security/ <ExternalLink size={16} className="ml-2" />
                </a>
              </dd>
            </div>
          </dl>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(7) Safety Measures Protecting Personal Data</h4>
          <p>We have taken technical and administrative security precautions to protect your personal data against loss, destruction, manipulation and unauthorized access. All our employees as well as service providers working for us are obliged to comply with the applicable data protection laws.</p>
          <p>Whenever we collect and process personal data, it is encrypted before it is transmitted. This means that your data cannot be misused by third parties. Our security precautions are subject to a continuous improvement process and our data protection declarations are constantly revised. Please make sure that you have the latest version.</p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(8) Observance of Laws, Ordinances and Other Rules</h4>
          <p>In regard to the Personal Data provided by you through this web site, we will comply with the relevant laws and ordinances, as well as other rules that are applicable in Japan. We will, as appropriate, modify its approach to the protection of Personal Data as changes to the relevant laws, ordinances, and social norms occur.</p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(9) Your rights</h4>
          <p>You have the right at any time to information, correction, deletion or restriction of the processing of your stored data, a right of objection to the processing as well as a right to data transfer and a right of complaint in accordance with the requirements of data protection law.</p>
          
          <div className="pl-4 border-l-4 border-gray-200 space-y-4 my-4">
            <div>
              <p className="font-bold text-gray-800">Right to information:</p>
              <p>You can request information from us as to whether and to what extent we process your data.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Right to correction:</p>
              <p>If we process your data that is incomplete or incorrect, you can demand that we correct or complete it at any time.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Right to deletion:</p>
              <p>You can demand that we delete your data if we process it unlawfully or if the processing disproportionately interferes with your legitimate protection interests. Please note that there may be reasons that prevent an immediate deletion, e.g. in the case of legally regulated storage obligations. Irrespective of the exercise of your right to deletion, we will delete your data immediately and completely, insofar as there is no legal or statutory obligation to retain data in this respect.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Right to limit the processing:</p>
              <p>You can ask us to restrict the processing of your data if:</p>
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>you dispute the accuracy of the data for a period of time that allows us to verify the accuracy of the data.</li>
                <li>the processing of the data is unlawful, but you refuse to delete it and instead demand a restriction on the use of the data,</li>
                <li>we no longer need the data for the intended purpose, but you still need this data to assert or defend legal claims, or</li>
                <li>you have objected to the processing of the data.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-800">Right to data transferability:</p>
              <p>You may request that we provide you with the information you have provided to us in a structured, common and machine-readable format and that you may provide that information to another responsible person without our interference, provided that:</p>
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>we process this data on the basis of an agreement given and revocable by you or for the fulfilment of a contract between us, and</li>
                <li>this processing is carried out using automated procedures.</li>
              </ul>
              <p className="mt-1">If technically feasible, you may request us to transfer your data directly to another responsible party.</p>
            </div>
          </div>

          <p>
            If you wish to assert any of the above rights against us, please contact us. In case of doubt, we can request additional information to confirm your identity.
          </p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(10) Personal data of the linked pages</h4>
          <p>Our website is linked to various other websites which refer to the cooperation with the customer service organisations of the company, the providers and others. However, we hereby declare that we are not responsible for the processing of personal data by such websites maintained by third parties, including the associated websites.</p>

          <h4 className="text-lg font-bold text-brand-secondary mt-8 mb-4">(11) Changes to this Privacy Policy</h4>
          <p>We reserve the right to change our privacy policy if necessary due to new technologies. Please make sure that you have the most updated version. If any essential changes are made to this privacy policy, we will notify those changes on our website.</p>
        </div>

      </div>
    </div>
  );
}